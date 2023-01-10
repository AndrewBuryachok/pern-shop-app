import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
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
      .andWhere('customerUser.id = :myId', { myId })
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
      : await this.cardsService.reduceCardBalance(dto);
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
        '(executorUser.name ILIKE :search OR customerUser.name ILIKE :search)',
        { search: `%${req.search || ''}%` },
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
