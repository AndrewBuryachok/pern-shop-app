import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Stall } from './stall.entity';
import { MarketTag } from '../markets-tags/market-tag.entity';
import { MarketsTagsService } from '../markets-tags/markets-tags.service';
import { PaymentsService } from '../payments/payments.service';
import { ExtCreateStallDto, ReserveStallDto } from './stall.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAfter } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { StallError } from './stall-error.enum';

@Injectable()
export class StallsService {
  constructor(
    @InjectRepository(Stall)
    private stallsRepository: Repository<Stall>,
    private marketsTagsService: MarketsTagsService,
    private paymentsService: PaymentsService,
  ) {}

  async getMainStalls(req: Request): Promise<Response<Stall>> {
    const [result, count] = await this.getStallsQueryBuilder(req)
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('stall.reservedUntil IS NULL')
            .orWhere('stall.reservedUntil < NOW()'),
        ),
      )
      .getManyAndCount();
    return { result, count };
  }

  async getMyStalls(myId: number, req: Request): Promise<Response<Stall>> {
    const [result, count] = await this.getStallsQueryBuilder(req)
      .innerJoin('ownerAccount.cards', 'ownerCards')
      .andWhere('ownerCards.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllStalls(req: Request): Promise<Response<Stall>> {
    const [result, count] = await this.getStallsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectMarketStalls(marketId: number): Promise<Stall[]> {
    return this.selectStallsQueryBuilder()
      .where('stall.marketId = :marketId', { marketId })
      .getMany();
  }

  selectTagStalls(marketTagId: number): Promise<Stall[]> {
    return this.selectStallsQueryBuilder()
      .where('stall.marketTagId = :marketTagId', { marketTagId })
      .getMany();
  }

  async selectStallTag(stallId: number): Promise<MarketTag> {
    const stall = await this.stallsRepository
      .createQueryBuilder('stall')
      .innerJoin('stall.marketTag', 'tag')
      .where('stall.id = :stallId', { stallId })
      .select(['stall.id', 'tag.id', 'tag.name', 'tag.price'])
      .getOne();
    return stall.marketTag;
  }

  async createStall(dto: ExtCreateStallDto): Promise<void> {
    const { marketId } = await this.marketsTagsService.checkMarketTagOwner(
      dto.marketTagId,
      dto.myId,
      dto.hasRole,
    );
    const name = (await this.countMarketStalls(marketId)) + 1;
    await this.create({ ...dto, marketId, name });
  }

  async reserveStall(dto: ReserveStallDto & { nick: string }): Promise<Stall> {
    const stall = await this.findFreeStall(dto.stallId);
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: stall.market.cardId,
      sum: stall.marketTag.price,
      description: '',
    });
    await this.reserve(stall);
    return stall;
  }

  async continueStall(dto: ReserveStallDto & { nick: string }): Promise<Stall> {
    const stall = await this.stallsRepository.findOne({
      relations: ['market', 'market.card', 'marketTag'],
      where: { id: dto.stallId },
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: stall.market.cardId,
      sum: stall.marketTag.price,
      description: '',
    });
    await this.continue(stall);
    return stall;
  }

  async unreserveStall(id: number): Promise<Stall> {
    const stall = await this.stallsRepository.findOne({
      relations: ['market', 'market.card'],
      where: { id },
    });
    await this.unreserve(stall);
    return stall;
  }

  async checkStallExists(id: number): Promise<void> {
    await this.stallsRepository.findOneByOrFail({ id });
  }

  private countMarketStalls(marketId: number): Promise<number> {
    return this.stallsRepository.countBy({ marketId });
  }

  private async findFreeStall(stallId: number): Promise<Stall> {
    const stall = await this.stallsRepository
      .createQueryBuilder('stall')
      .innerJoinAndSelect('stall.market', 'market')
      .innerJoinAndSelect('market.card', 'card')
      .innerJoinAndSelect('stall.marketTag', 'marketTag')
      .where('stall.id = :stallId', { stallId })
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('stall.reservedUntil IS NULL')
            .orWhere('stall.reservedUntil < NOW()'),
        ),
      )
      .getOne();
    if (!stall) {
      throw new AppException(StallError.NOT_FREE);
    }
    return stall;
  }

  private async create(dto: ExtCreateStallDto): Promise<Stall> {
    try {
      const stall = this.stallsRepository.create({
        marketId: dto.marketId,
        marketTagId: dto.marketTagId,
        name: dto.name,
      });
      await this.stallsRepository.save(stall);
      return stall;
    } catch (error) {
      throw new AppException(StallError.CREATE_FAILED);
    }
  }

  private async reserve(stall: Stall): Promise<void> {
    try {
      stall.reservedUntil = getDateWeekAfter();
      await this.stallsRepository.save(stall);
    } catch (error) {
      throw new AppException(StallError.RESERVE_FAILED);
    }
  }

  private async continue(stall: Stall): Promise<void> {
    try {
      stall.reservedUntil.setDate(stall.reservedUntil.getDate() + 7);
      await this.stallsRepository.save(stall);
    } catch (error) {
      throw new AppException(StallError.CONTINUE_FAILED);
    }
  }

  private async unreserve(stall: Stall): Promise<void> {
    try {
      stall.reservedUntil = new Date();
      await this.stallsRepository.save(stall);
    } catch (error) {
      throw new AppException(StallError.UNRESERVE_FAILED);
    }
  }

  private selectStallsQueryBuilder(): SelectQueryBuilder<Stall> {
    return this.stallsRepository
      .createQueryBuilder('stall')
      .orderBy('stall.name', 'ASC')
      .select(['stall.id', 'stall.name']);
  }

  private getStallsQueryBuilder(req: Request): SelectQueryBuilder<Stall> {
    return this.stallsRepository
      .createQueryBuilder('stall')
      .innerJoin('stall.market', 'market')
      .innerJoin('market.card', 'ownerCard')
      .innerJoin('ownerCard.account', 'ownerAccount')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('stall.marketTag', 'marketTag')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('stall.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere('ownerUser.id = :userId', { userId: req.user }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.card}`)
            .orWhere('ownerCard.id = :cardId', { cardId: req.card }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.market}`)
            .orWhere('market.id = :marketId', { marketId: req.market }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.marketTag}`).orWhere('marketTag.id = :marketTagId', {
            marketTagId: req.marketTag,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.stall}`)
            .orWhere('stall.id = :stallId', { stallId: req.stall }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.minPrice}`).orWhere('marketTag.price >= :minPrice', {
            minPrice: req.minPrice,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.maxPrice}`).orWhere('marketTag.price <= :maxPrice', {
            maxPrice: req.maxPrice,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== 1}`)
            .orWhere('stall.reservedUntil IS NULL')
            .orWhere('stall.reservedUntil < NOW()'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== -1}`)
            .orWhere('stall.reservedUntil > NOW()'),
        ),
      )
      .orderBy('stall.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'stall.id',
        'market.id',
        'ownerCard.id',
        'ownerAccount.id',
        'ownerAccount.name',
        'ownerAccount.color',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'market.name',
        'market.x',
        'market.y',
        'marketTag.id',
        'marketTag.name',
        'marketTag.price',
        'stall.name',
        'stall.reservedUntil',
      ]);
  }
}
