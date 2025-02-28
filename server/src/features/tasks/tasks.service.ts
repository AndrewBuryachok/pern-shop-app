import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Task } from './task.entity';
import { CardsService } from '../cards/cards.service';
import { PaymentsService } from '../payments/payments.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ExtCreateTaskDto,
  ExtEditTaskDto,
  ExtTaskIdDto,
  ExtRateTaskDto,
  ExtTakeTaskDto,
} from './task.dto';
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
    private cardsService: CardsService,
    private paymentsService: PaymentsService,
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
      .innerJoin('customerCard.users', 'customerUsers')
      .andWhere('customerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getTakenTasks(myId: number, req: Request): Promise<Response<Task>> {
    const [result, count] = await this.getTasksQueryBuilder(req)
      .leftJoin('executorCard.users', 'executorUsers')
      .andWhere('executorUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllTasks(req: Request): Promise<Response<Task>> {
    const [result, count] = await this.getTasksQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createTask(dto: ExtCreateTaskDto & { nick: string }): Promise<void> {
    await this.cardsService.checkCardUser(dto.cardId, dto.myId, dto.hasRole);
    await this.cardsService.decreaseCardBalance({ ...dto, sum: dto.price });
    const task = await this.create(dto);
    this.mqttService.publishNotification(
      task.id,
      0,
      dto.nick,
      Notification.CREATED_TASK,
    );
  }

  async editTask(dto: ExtEditTaskDto): Promise<void> {
    const task = await this.checkTaskCustomer(
      dto.taskId,
      dto.myId,
      dto.hasRole,
    );
    if (task.status !== Status.CREATED) {
      throw new AppException(TaskError.ALREADY_TAKEN);
    }
    if (dto.price !== task.price) {
      if (dto.price < task.price) {
        await this.cardsService.increaseCardBalance({
          cardId: task.customerCardId,
          sum: task.price - dto.price,
        });
      } else {
        await this.cardsService.decreaseCardBalance({
          cardId: task.customerCardId,
          sum: dto.price - task.price,
        });
      }
    }
    await this.edit(task, dto);
  }

  async takeTask(dto: ExtTakeTaskDto & { nick: string }): Promise<void> {
    await this.cardsService.checkCardUser(dto.cardId, dto.myId, dto.hasRole);
    const task = await this.tasksRepository.findOne({
      relations: ['customerCard'],
      where: { id: dto.taskId },
    });
    if (task.status !== Status.CREATED) {
      throw new AppException(TaskError.ALREADY_TAKEN);
    }
    await this.take(task, dto.cardId);
    this.mqttService.publishNotification(
      dto.taskId,
      task.customerCard.userId,
      dto.nick,
      Notification.TAKEN_TASK,
    );
  }

  async untakeTask(dto: ExtTaskIdDto & { nick: string }): Promise<void> {
    const task = await this.checkTaskExecutor(
      dto.taskId,
      dto.myId,
      dto.hasRole,
    );
    if (task.status !== Status.TAKEN) {
      throw new AppException(TaskError.NOT_TAKEN);
    }
    await this.untake(task);
    this.mqttService.publishNotification(
      dto.taskId,
      task.customerCard.userId,
      dto.nick,
      Notification.UNTAKEN_TASK,
    );
  }

  async executeTask(dto: ExtTaskIdDto & { nick: string }): Promise<void> {
    const task = await this.checkTaskExecutor(
      dto.taskId,
      dto.myId,
      dto.hasRole,
    );
    if (task.status !== Status.TAKEN) {
      throw new AppException(TaskError.NOT_TAKEN);
    }
    await this.execute(task);
    this.mqttService.publishNotification(
      dto.taskId,
      task.customerCard.userId,
      dto.nick,
      Notification.EXECUTED_TASK,
    );
  }

  async completeTask(dto: ExtTaskIdDto & { nick: string }): Promise<void> {
    const task = await this.checkTaskCustomer(
      dto.taskId,
      dto.myId,
      dto.hasRole,
    );
    if (task.status !== Status.EXECUTED) {
      throw new AppException(TaskError.NOT_EXECUTED);
    }
    await this.cardsService.increaseCardBalance({
      cardId: task.customerCardId,
      sum: task.price,
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: task.customerCardId,
      receiverCardId: task.executorCardId,
      sum: task.price,
      description: 'выполнение заказа',
    });
    await this.complete(task);
    this.unpublishNotification(dto.taskId, dto.nick);
    this.mqttService.publishNotification(
      dto.taskId,
      task.executorCard.userId,
      dto.nick,
      Notification.COMPLETED_TASK,
    );
  }

  async deleteTask(dto: ExtTaskIdDto & { nick: string }): Promise<void> {
    const task = await this.checkTaskCustomer(
      dto.taskId,
      dto.myId,
      dto.hasRole,
    );
    if (task.status !== Status.CREATED) {
      throw new AppException(TaskError.ALREADY_TAKEN);
    }
    await this.cardsService.increaseCardBalance({
      cardId: task.customerCardId,
      sum: task.price,
    });
    await this.delete(task);
    this.unpublishNotification(dto.taskId, dto.nick);
  }

  async rateTask(dto: ExtRateTaskDto & { nick: string }): Promise<void> {
    const task = await this.checkTaskCustomer(
      dto.taskId,
      dto.myId,
      dto.hasRole,
    );
    if (task.status !== Status.COMPLETED) {
      throw new AppException(TaskError.NOT_COMPLETED);
    }
    await this.rate(task, dto.rate);
    this.mqttService.publishNotification(
      dto.taskId,
      task.executorCard.userId,
      dto.nick,
      Notification.RATED_TASK,
    );
  }

  async checkTaskExists(id: number): Promise<void> {
    await this.tasksRepository.findOneByOrFail({ id });
  }

  private async checkTaskCustomer(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      relations: ['customerCard', 'customerCard.users', 'executorCard'],
      where: { id },
    });
    if (
      !task.customerCard.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
      throw new AppException(TaskError.NOT_CUSTOMER);
    }
    return task;
  }

  private async checkTaskExecutor(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      relations: ['executorCard', 'executorCard.users', 'customerCard'],
      where: { id },
    });
    if (
      !task.executorCard.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
      throw new AppException(TaskError.NOT_EXECUTOR);
    }
    return task;
  }

  private async create(dto: ExtCreateTaskDto): Promise<Task> {
    try {
      const task = this.tasksRepository.create({
        customerCardId: dto.cardId,
        activity: dto.activity,
        text: dto.text,
        price: dto.price,
      });
      await this.tasksRepository.save(task);
      return task;
    } catch (error) {
      throw new AppException(TaskError.CREATE_FAILED);
    }
  }

  private async edit(task: Task, dto: ExtEditTaskDto): Promise<void> {
    try {
      task.activity = dto.activity;
      task.text = dto.text;
      task.price = dto.price;
      await this.tasksRepository.save(task);
    } catch (error) {
      throw new AppException(TaskError.EDIT_FAILED);
    }
  }

  private async take(task: Task, cardId: number): Promise<void> {
    try {
      task.executorCardId = cardId;
      task.status = Status.TAKEN;
      await this.tasksRepository.save(task);
    } catch (error) {
      throw new AppException(TaskError.TAKE_FAILED);
    }
  }

  private async untake(task: Task): Promise<void> {
    try {
      task.executorCard = null;
      task.executorCardId = null;
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

  private async rate(task: Task, rate: number): Promise<void> {
    try {
      task.rate = rate;
      await this.tasksRepository.save(task);
    } catch (error) {
      throw new AppException(TaskError.RATE_FAILED);
    }
  }

  private unpublishNotification(id: number, nick: string): void {
    this.mqttService.unpublishNotification(
      id,
      0,
      nick,
      Notification.CREATED_TASK,
    );
  }

  private getTasksQueryBuilder(req: Request): SelectQueryBuilder<Task> {
    return this.tasksRepository
      .createQueryBuilder('task')
      .innerJoin('task.customerCard', 'customerCard')
      .innerJoin('customerCard.user', 'customerUser')
      .leftJoin('task.executorCard', 'executorCard')
      .leftJoin('executorCard.user', 'executorUser')
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
            .where(`${!req.card}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.CUSTOMER}`)
                  .andWhere('customerCard.id = :cardId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.EXECUTOR}`)
                  .andWhere('executorCard.id = :cardId'),
              ),
            ),
        ),
        { cardId: req.card },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.activity}`)
            .orWhere('task.activity ILIKE :activity', {
              activity: req.activity,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minPrice}`)
            .orWhere('task.price >= :minPrice', { minPrice: req.minPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('task.price <= :maxPrice', { maxPrice: req.maxPrice }),
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
            .where(`${!req.rate}`)
            .orWhere('task.rate = :rate', { rate: req.rate }),
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
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== 1}`)
            .orWhere('task.completedAt IS NOT NULL'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== -1}`)
            .orWhere('task.completedAt IS NULL'),
        ),
      )
      .orderBy('task.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'task.id',
        'customerCard.id',
        'customerUser.id',
        'customerUser.nick',
        'customerUser.avatar',
        'customerCard.name',
        'customerCard.color',
        'task.activity',
        'task.text',
        'task.price',
        'task.status',
        'executorCard.id',
        'executorUser.id',
        'executorUser.nick',
        'executorUser.avatar',
        'executorCard.name',
        'executorCard.color',
        'task.createdAt',
        'task.completedAt',
        'task.rate',
      ]);
  }
}
