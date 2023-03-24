import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Exchange } from './exchange.entity';
import { CardsService } from '../cards/cards.service';
import { ExtCreateExchangeDto } from './exchange.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { ExchangeError } from './exchange-error.enum';

@Injectable()
export class ExchangesService {
  constructor(
    @InjectRepository(Exchange)
    private exchangesRepository: Repository<Exchange>,
    private cardsService: CardsService,
  ) {}

  async getMyExchanges(
    myId: number,
    req: Request,
  ): Promise<Response<Exchange>> {
    const [result, count] = await this.getExchangesQueryBuilder(req)
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('executorUser.id = :myId')
            .orWhere('customerUser.id = :myId'),
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
    dto.type
      ? await this.cardsService.increaseCardBalance(dto)
      : await this.cardsService.decreaseCardBalance(dto);
    this.create(dto);
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
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode}`)
                  .andWhere(
                    `executorUser.id ${
                      req.filters.includes('executor') ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `customerUser.id ${
                      req.filters.includes('customer') ? '=' : '!='
                    } :userId`,
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes('executor')}`)
                              .andWhere('executorUser.id = :userId'),
                          ),
                        )
                        .orWhere(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes('customer')}`)
                              .andWhere('customerUser.id = :userId'),
                          ),
                        ),
                    ),
                  ),
              ),
            ),
        ),
        { userId: req.user },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.type}`)
            .orWhere('exchange.type = :type', { type: req.type === 1 }),
        ),
      )
      .orderBy('exchange.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'exchange.id',
        'executorUser.id',
        'executorUser.name',
        'executorUser.status',
        'customerCard.id',
        'customerUser.id',
        'customerUser.name',
        'customerUser.status',
        'customerCard.name',
        'customerCard.color',
        'exchange.type',
        'exchange.sum',
        'exchange.createdAt',
      ]);
  }
}
