import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Exchange } from './exchange.entity';
import { CardsService } from '../cards/cards.service';
import { ExtCreateExchangeDto } from './exchange.dto';
import { AppException } from '../../common/exceptions';
import { ExchangeError } from './exchange-error.enum';

@Injectable()
export class ExchangesService {
  constructor(
    @InjectRepository(Exchange)
    private exchangesRepository: Repository<Exchange>,
    private cardsService: CardsService,
  ) {}

  getMyExchanges(myId: number): Promise<Exchange[]> {
    return this.getExchangesQueryBuilder()
      .where('customerUser.id = :myId', { myId })
      .getMany();
  }

  getAllExchanges(): Promise<Exchange[]> {
    return this.getExchangesQueryBuilder().getMany();
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

  private getExchangesQueryBuilder(): SelectQueryBuilder<Exchange> {
    return this.exchangesRepository
      .createQueryBuilder('exchange')
      .innerJoin('exchange.executorUser', 'executorUser')
      .innerJoin('exchange.customerCard', 'customerCard')
      .innerJoin('customerCard.user', 'customerUser')
      .orderBy('exchange.id', 'DESC')
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
