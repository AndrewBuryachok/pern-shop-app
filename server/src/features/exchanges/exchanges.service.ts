import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Exchange } from './exchange.entity';
import { CardsService } from '../cards/cards.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateExchangeDto } from './exchange.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { ExchangeError } from './exchange-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class ExchangesService {
  constructor(
    @InjectRepository(Exchange)
    private exchangesRepository: Repository<Exchange>,
    private cardsService: CardsService,
    private mqttService: MqttService,
  ) {}

  async getMyExchanges(
    myId: number,
    req: Request,
  ): Promise<Response<Exchange>> {
    const [result, count] = await this.getExchangesQueryBuilder(req)
      .innerJoin('customerCard.users', 'customerUsers')
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('executorUser.id = :myId')
            .orWhere('customerUsers.id = :myId'),
        ),
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getAllExchanges(req: Request): Promise<Response<Exchange>> {
    const [result, count] = await this.getExchangesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createExchange(dto: ExtCreateExchangeDto): Promise<void> {
    const card = dto.type
      ? await this.cardsService.increaseCardBalance(dto)
      : await this.cardsService.decreaseCardBalance(dto);
    this.create(dto);
    this.mqttService.publishNotificationMessage(
      card.userId,
      Notification.CREATED_EXCHANGE,
    );
  }

  private async create(dto: ExtCreateExchangeDto): Promise<void> {
    try {
      const exchange = this.exchangesRepository.create({
        executorUserId: dto.myId,
        customerCardId: dto.cardId,
        type: dto.type,
        sum: dto.sum,
      });
      await this.exchangesRepository.save(exchange);
    } catch (error) {
      throw new AppException(ExchangeError.CREATE_FAILED);
    }
  }

  private getExchangesQueryBuilder(req: Request): SelectQueryBuilder<Exchange> {
    return this.exchangesRepository
      .createQueryBuilder('exchange')
      .innerJoin('exchange.executorUser', 'executorUser')
      .innerJoin('exchange.customerCard', 'customerCard')
      .innerJoin('customerCard.user', 'customerUser')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('exchange.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.EXECUTOR}`)
                  .andWhere('executorUser.id = :userId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.CUSTOMER}`)
                  .andWhere('customerUser.id = :userId'),
              ),
            ),
        ),
        { userId: req.user },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.card}`)
            .orWhere('customerCard.id = :cardId', { cardId: req.card }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.type}`)
            .orWhere('exchange.type = :type', { type: req.type === 1 }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minSum}`)
            .orWhere('exchange.sum >= :minSum', { minSum: req.minSum }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxSum}`)
            .orWhere('exchange.sum <= :maxSum', { maxSum: req.maxSum }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('exchange.createdAt >= :minDate', {
              minDate: req.minDate,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('exchange.createdAt <= :maxDate', {
              maxDate: req.maxDate,
            }),
        ),
      )
      .orderBy('exchange.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'exchange.id',
        'executorUser.id',
        'executorUser.name',
        'customerCard.id',
        'customerUser.id',
        'customerUser.name',
        'customerCard.name',
        'customerCard.color',
        'exchange.type',
        'exchange.sum',
        'exchange.createdAt',
      ]);
  }
}
