import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Task } from './task.entity';
import { ExtCreateTaskDto, ExtTaskIdDto } from './task.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { TaskError } from './task-error.enum';
import { TransportationStatus } from '../transportations/transportation-status.enum';
import { Filter, Mode } from '../../common/enums';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getMainTasks(myId: number, req: Request): Promise<Response<Task>> {
    const [result, count] = await this.getTasksQueryBuilder(req)
      .leftJoin('city.users', 'cityUsers')
      .andWhere('cityUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getMyTasks(myId: number, req: Request): Promise<Response<Task>> {
    const [result, count] = await this.getTasksQueryBuilder(req)
      .andWhere('customerUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getTakenTasks(myId: number, req: Request): Promise<Response<Task>> {
    const [result, count] = await this.getTasksQueryBuilder(req)
      .andWhere('executorUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedTasks(myId: number, req: Request): Promise<Response<Task>> {
    const [result, count] = await this.getTasksQueryBuilder(req)
      .andWhere('ownerUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllTasks(req: Request): Promise<Response<Task>> {
    const [result, count] = await this.getTasksQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createTask(dto: ExtCreateTaskDto): Promise<void> {
    await this.create(dto);
  }

  async takeTask(dto: ExtTaskIdDto): Promise<void> {
    const task = await this.tasksRepository.findOneBy({
      id: dto.taskId,
    });
    if (task.executorUserId) {
      throw new AppException(TaskError.ALREADY_TAKEN);
    }
    await this.take(task, dto.myId);
  }

  async untakeTask(dto: ExtTaskIdDto): Promise<void> {
    const task = await this.checkTaskExecutor(dto.taskId, dto.myId);
    if (task.status !== TransportationStatus.TAKEN) {
      throw new AppException(TaskError.ALREADY_EXECUTED);
    }
    await this.untake(task);
  }

  async executeTask(dto: ExtTaskIdDto): Promise<void> {
    const task = await this.checkTaskExecutor(dto.taskId, dto.myId);
    if (task.status !== TransportationStatus.TAKEN) {
      throw new AppException(TaskError.ALREADY_EXECUTED);
    }
    await this.execute(task);
  }

  async completeTask(dto: ExtTaskIdDto): Promise<void> {
    const task = await this.checkTaskCustomer(dto.taskId, dto.myId);
    if (task.completedAt) {
      throw new AppException(TaskError.ALREADY_COMPLETED);
    }
    if (task.status !== TransportationStatus.EXECUTED) {
      throw new AppException(TaskError.NOT_EXECUTED);
    }
    await this.complete(task);
  }

  async deleteTask(dto: ExtTaskIdDto): Promise<void> {
    const task = await this.checkTaskCustomer(dto.taskId, dto.myId);
    if (task.executorUserId) {
      throw new AppException(TaskError.ALREADY_TAKEN);
    }
    await this.delete(task);
  }

  async checkTaskExists(id: number): Promise<void> {
    await this.tasksRepository.findOneByOrFail({ id });
  }

  private async checkTaskCustomer(
    id: number,
    customerUserId: number,
  ): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id, customerUserId });
    if (!task) {
      throw new AppException(TaskError.NOT_CUSTOMER);
    }
    return task;
  }

  private async checkTaskExecutor(
    id: number,
    executorUserId: number,
  ): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id, executorUserId });
    if (!task) {
      throw new AppException(TaskError.NOT_EXECUTOR);
    }
    return task;
  }

  private async create(dto: ExtCreateTaskDto): Promise<void> {
    try {
      const task = this.tasksRepository.create({
        customerUserId: dto.myId,
        description: dto.description,
      });
      await this.tasksRepository.save(task);
    } catch (error) {
      throw new AppException(TaskError.CREATE_FAILED);
    }
  }

  private async take(task: Task, userId: number): Promise<void> {
    try {
      task.executorUserId = userId;
      task.status = TransportationStatus.TAKEN;
      await this.tasksRepository.save(task);
    } catch (error) {
      throw new AppException(TaskError.TAKE_FAILED);
    }
  }

  private async untake(task: Task): Promise<void> {
    try {
      task.executorUserId = null;
      task.status = TransportationStatus.CREATED;
      await this.tasksRepository.save(task);
    } catch (error) {
      throw new AppException(TaskError.UNTAKE_FAILED);
    }
  }

  private async execute(task: Task): Promise<void> {
    try {
      task.status = TransportationStatus.EXECUTED;
      await this.tasksRepository.save(task);
    } catch (error) {
      throw new AppException(TaskError.EXECUTE_FAILED);
    }
  }

  private async complete(task: Task): Promise<void> {
    try {
      task.completedAt = new Date();
      task.status = TransportationStatus.COMPLETED;
      await this.tasksRepository.save(task);
    } catch (error) {
      throw new AppException(TaskError.COMPLETE_FAILED);
    }
  }

  private async delete(task: Task): Promise<void> {
    try {
      await this.tasksRepository.remove(task);
    } catch (error) {
      throw new AppException(TaskError.DELETE_FAILED);
    }
  }

  private getTasksQueryBuilder(req: Request): SelectQueryBuilder<Task> {
    return this.tasksRepository
      .createQueryBuilder('task')
      .innerJoin('task.customerUser', 'customerUser')
      .leftJoin('task.executorUser', 'executorUser')
      .leftJoin('customerUser.city', 'city')
      .leftJoin('city.user', 'ownerUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb.where(`${req.mode === Mode.SOME}`).andWhere(
                  new Brackets((qb) =>
                    qb
                      .where(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.CUSTOMER)}`)
                            .andWhere('customerUser.id = :userId'),
                        ),
                      )
                      .orWhere(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.EXECUTOR)}`)
                            .andWhere('executorUser.id = :userId'),
                        ),
                      )
                      .orWhere(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.OWNER)}`)
                            .andWhere('ownerUser.id = :userId'),
                        ),
                      ),
                  ),
                ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.EACH}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.CUSTOMER)}`)
                        .orWhere('customerUser.id = :userId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.EXECUTOR)}`)
                        .orWhere('executorUser.id = :userId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.OWNER)}`)
                        .orWhere('ownerUser.id = :userId'),
                    ),
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.ONLY}`)
                  .andWhere(
                    `customerUser.id ${
                      req.filters.includes(Filter.CUSTOMER) ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `executorUser.id ${
                      req.filters.includes(Filter.EXECUTOR) ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `ownerUser.id ${
                      req.filters.includes(Filter.OWNER) ? '=' : '!='
                    } :userId`,
                  ),
              ),
            ),
        ),
        { userId: req.user },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.city}`, { cityId: req.city })
            .orWhere('city.id = :cityId'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.description}`)
            .orWhere('task.description ILIKE :description', {
              description: req.description,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.priority}`)
            .orWhere('task.priority = :priority', { priority: req.priority }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.status}`)
            .orWhere('task.status = :status', { status: req.status }),
        ),
      )
      .orderBy('task.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'task.id',
        'customerUser.id',
        'customerUser.name',
        'customerUser.status',
        'task.description',
        'task.priority',
        'task.createdAt',
        'executorUser.id',
        'executorUser.name',
        'executorUser.status',
        'task.completedAt',
        'task.status',
      ]);
  }
}