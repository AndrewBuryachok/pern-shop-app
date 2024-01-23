import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Task } from './task.entity';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateTaskDto, ExtTakeTaskDto, ExtTaskIdDto } from './task.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { TaskError } from './task-error.enum';
import { Status } from '../transportations/status.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private mqttService: MqttService,
  ) {}

  async getMainTasks(req: Request): Promise<Response<Task>> {
    const [result, count] = await this.getTasksQueryBuilder(req)
      .andWhere('task.status = :status', {
        status: Status.CREATED,
      })
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

  async getAllTasks(req: Request): Promise<Response<Task>> {
    const [result, count] = await this.getTasksQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createTask(dto: ExtCreateTaskDto): Promise<void> {
    await this.create(dto);
  }

  async takeTask(dto: ExtTakeTaskDto): Promise<void> {
    const task = await this.tasksRepository.findOneBy({
      id: dto.taskId,
    });
    if (task.status !== Status.CREATED) {
      throw new AppException(TaskError.NOT_CREATED);
    }
    await this.take(task, dto.userId);
    this.mqttService.publishNotificationMessage(
      task.customerUserId,
      Notification.TAKEN_TASK,
    );
  }

  async untakeTask(dto: ExtTaskIdDto): Promise<void> {
    const task = await this.checkTaskExecutor(
      dto.taskId,
      dto.myId,
      dto.hasRole,
    );
    if (task.status !== Status.TAKEN) {
      throw new AppException(TaskError.NOT_TAKEN);
    }
    await this.untake(task);
    this.mqttService.publishNotificationMessage(
      task.customerUserId,
      Notification.UNTAKEN_TASK,
    );
  }

  async executeTask(dto: ExtTaskIdDto): Promise<void> {
    const task = await this.checkTaskExecutor(
      dto.taskId,
      dto.myId,
      dto.hasRole,
    );
    if (task.status !== Status.TAKEN) {
      throw new AppException(TaskError.NOT_TAKEN);
    }
    await this.execute(task);
    this.mqttService.publishNotificationMessage(
      task.customerUserId,
      Notification.EXECUTED_TASK,
    );
  }

  async completeTask(dto: ExtTaskIdDto): Promise<void> {
    const task = await this.checkTaskCustomer(
      dto.taskId,
      dto.myId,
      dto.hasRole,
    );
    if (task.status !== Status.EXECUTED) {
      throw new AppException(TaskError.NOT_EXECUTED);
    }
    await this.complete(task);
    this.mqttService.publishNotificationMessage(
      task.executorUserId,
      Notification.COMPLETED_TASK,
    );
  }

  async deleteTask(dto: ExtTaskIdDto): Promise<void> {
    const task = await this.checkTaskCustomer(
      dto.taskId,
      dto.myId,
      dto.hasRole,
    );
    if (task.status !== Status.CREATED) {
      throw new AppException(TaskError.NOT_CREATED);
    }
    await this.delete(task);
  }

  async checkTaskExists(id: number): Promise<void> {
    await this.tasksRepository.findOneByOrFail({ id });
  }

  private async checkTaskCustomer(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (task.customerUserId !== userId && !hasRole) {
      throw new AppException(TaskError.NOT_CUSTOMER);
    }
    return task;
  }

  private async checkTaskExecutor(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (task.executorUserId !== userId && !hasRole) {
      throw new AppException(TaskError.NOT_EXECUTOR);
    }
    return task;
  }

  private async create(dto: ExtCreateTaskDto): Promise<void> {
    try {
      const task = this.tasksRepository.create({
        customerUserId: dto.userId,
        title: dto.title,
        text: dto.text,
        priority: dto.priority,
      });
      await this.tasksRepository.save(task);
    } catch (error) {
      throw new AppException(TaskError.CREATE_FAILED);
    }
  }

  private async take(task: Task, userId: number): Promise<void> {
    try {
      task.executorUserId = userId;
      task.status = Status.TAKEN;
      await this.tasksRepository.save(task);
    } catch (error) {
      throw new AppException(TaskError.TAKE_FAILED);
    }
  }

  private async untake(task: Task): Promise<void> {
    try {
      task.executorUserId = null;
      task.status = Status.CREATED;
      await this.tasksRepository.save(task);
    } catch (error) {
      throw new AppException(TaskError.UNTAKE_FAILED);
    }
  }

  private async execute(task: Task): Promise<void> {
    try {
      task.status = Status.EXECUTED;
      await this.tasksRepository.save(task);
    } catch (error) {
      throw new AppException(TaskError.EXECUTE_FAILED);
    }
  }

  private async complete(task: Task): Promise<void> {
    try {
      task.completedAt = new Date();
      task.status = Status.COMPLETED;
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
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('task.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.CUSTOMER}`)
                  .andWhere('customerUser.id = :userId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.EXECUTOR}`)
                  .andWhere('executorUser.id = :userId'),
              ),
            ),
        ),
        { userId: req.user },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.title}`)
            .orWhere('task.title ILIKE :title', { title: req.title }),
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
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('task.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('task.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .orderBy('task.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'task.id',
        'customerUser.id',
        'customerUser.nick',
        'customerUser.avatar',
        'task.title',
        'task.text',
        'task.priority',
        'task.status',
        'task.createdAt',
        'executorUser.id',
        'executorUser.nick',
        'executorUser.avatar',
        'task.completedAt',
      ]);
  }
}
