import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Lot } from './lot.entity';
import { Bid } from '../bids/bid.entity';
import { LeasesService } from '../leases/leases.service';
import { CardsService } from '../cards/cards.service';
import { PaymentsService } from '../payments/payments.service';
import { MqttService } from '../mqtt/mqtt.service';
import { BuyLotDto, CompleteLotDto, ExtCreateLotDto } from './lot.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { LotError } from './lot-error.enum';
import { Kind } from '../leases/kind.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot)
    private lotsRepository: Repository<Lot>,
    private leasesService: LeasesService,
    private cardsService: CardsService,
    private paymentsService: PaymentsService,
    private mqttService: MqttService,
  ) {}

  async getMainLots(req: Request): Promise<Response<Lot>> {
    const [result, count] = await this.getLotsQueryBuilder(req)
      .andWhere('lot.completedAt IS NULL')
      .andWhere('lease.completedAt > NOW()')
      .getManyAndCount();
    return { result, count };
  }

  async getMyLots(myId: number, req: Request): Promise<Response<Lot>> {
    const [result, count] = await this.getLotsQueryBuilder(req)
      .innerJoin('sellerCard.users', 'sellerUsers')
      .andWhere('sellerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedLots(myId: number, req: Request): Promise<Response<Lot>> {
    const [result, count] = await this.getLotsQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllLots(req: Request): Promise<Response<Lot>> {
    const [result, count] = await this.getLotsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async selectLotBids(lotId: number): Promise<Bid[]> {
    const lot = await this.lotsRepository
      .createQueryBuilder('lot')
      .leftJoin('lot.bids', 'bid')
      .where('lot.id = :lotId', { lotId })
      .orderBy('bid.id', 'DESC')
      .select(['lot.id', 'lot.price', 'bid.id', 'bid.price', 'bid.createdAt'])
      .getOne();
    return lot.bids;
  }

  async createLot(dto: ExtCreateLotDto & { nick: string }): Promise<void> {
    const leaseId = await this.leasesService.createLease({
      ...dto,
      kind: Kind.LOT,
    });
    const lot = await this.create({ ...dto, storageId: leaseId });
    this.mqttService.publishNotificationMessage(
      lot.id,
      0,
      dto.nick,
      Notification.CREATED_LOT,
    );
  }

  async buyLot(dto: BuyLotDto): Promise<Lot> {
    const lot = await this.lotsRepository.findOne({
      relations: ['lease', 'lease.card'],
      where: { id: dto.lotId },
    });
    if (lot.price >= dto.price) {
      throw new AppException(LotError.NOT_ENOUGH_PRICE);
    }
    if (lot.completedAt) {
      throw new AppException(LotError.ALREADY_COMPLETED);
    }
    if (lot.lease.completedAt < new Date()) {
      throw new AppException(LotError.ALREADY_EXPIRED);
    }
    await this.cardsService.decreaseCardBalance({ ...dto, sum: dto.price });
    await this.buy(lot, dto.price);
    return lot;
  }

  async completeLot(dto: CompleteLotDto & { nick: string }): Promise<void> {
    const lot = await this.checkLotOwner(dto.lotId, dto.myId, dto.hasRole);
    const promises = lot.bids.map(
      async (bid) =>
        await this.cardsService.increaseCardBalance({ ...bid, sum: bid.price }),
    );
    await Promise.all(promises);
    await this.paymentsService.createPayment({
      myId: lot.bids[0].card.userId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: lot.bids[0].cardId,
      receiverCardId: lot.lease.cardId,
      sum: lot.price,
      description: '',
    });
    await this.complete(lot);
    lot.bids.forEach((bid) =>
      this.mqttService.publishNotificationMessage(
        bid.id,
        bid.card.userId,
        dto.nick,
        Notification.COMPLETED_BID,
      ),
    );
  }

  async checkLotExists(id: number): Promise<void> {
    await this.lotsRepository.findOneByOrFail({ id });
  }

  async checkLotOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Lot> {
    const lot = await this.lotsRepository.findOne({
      relations: [
        'lease',
        'lease.card',
        'lease.card.users',
        'bids',
        'bids.card',
      ],
      where: { id },
      order: { bids: { id: 'DESC' } },
    });
    if (
      !lot.lease.card.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
      throw new AppException(LotError.NOT_OWNER);
    }
    if (lot.completedAt) {
      throw new AppException(LotError.ALREADY_COMPLETED);
    }
    return lot;
  }

  private async create(dto: ExtCreateLotDto): Promise<Lot> {
    try {
      const lot = this.lotsRepository.create({
        leaseId: dto.storageId,
        item: dto.item,
        description: dto.description,
        amount: dto.amount,
        intake: dto.intake,
        kit: dto.kit,
        price: dto.price,
      });
      await this.lotsRepository.save(lot);
      return lot;
    } catch (error) {
      throw new AppException(LotError.CREATE_FAILED);
    }
  }

  private async buy(lot: Lot, price: number): Promise<void> {
    try {
      lot.price = price;
      await this.lotsRepository.save(lot);
    } catch (error) {
      throw new AppException(LotError.BUY_FAILED);
    }
  }

  private async complete(lot: Lot): Promise<void> {
    try {
      lot.completedAt = new Date();
      await this.lotsRepository.save(lot);
    } catch (error) {
      throw new AppException(LotError.COMPLETE_FAILED);
    }
  }

  private getLotsQueryBuilder(req: Request): SelectQueryBuilder<Lot> {
    return this.lotsRepository
      .createQueryBuilder('lot')
      .innerJoin('lot.lease', 'lease')
      .innerJoin('lease.cell', 'cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('lease.card', 'sellerCard')
      .innerJoin('sellerCard.user', 'sellerUser')
      .loadRelationCountAndMap('lot.bids', 'lot.bids')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('lot.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.SELLER}`)
                  .andWhere('sellerUser.id = :userId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.OWNER}`)
                  .andWhere('ownerUser.id = :userId'),
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
                  .where(`${!req.mode || req.mode === Mode.SELLER}`)
                  .andWhere('sellerCard.id = :cardId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.OWNER}`)
                  .andWhere('ownerCard.id = :cardId'),
              ),
            ),
        ),
        { cardId: req.card },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.storage}`)
            .orWhere('storage.id = :storageId', { storageId: req.storage }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.cell}`)
            .orWhere('cell.id = :cellId', { cellId: req.cell }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.item}`)
            .orWhere('lot.item = :item', { item: req.item }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.description}`)
            .orWhere('lot.description ILIKE :description', {
              description: req.description,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minAmount}`)
            .orWhere('lot.amount >= :minAmount', { minAmount: req.minAmount }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxAmount}`)
            .orWhere('lot.amount <= :maxAmount', { maxAmount: req.maxAmount }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minIntake}`)
            .orWhere('lot.intake >= :minIntake', { minIntake: req.minIntake }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxIntake}`)
            .orWhere('lot.intake <= :maxIntake', { maxIntake: req.maxIntake }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.kit}`).orWhere('lot.kit = :kit', { kit: req.kit }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minPrice}`)
            .orWhere('lot.price >= :minPrice', { minPrice: req.minPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('lot.price <= :maxPrice', { maxPrice: req.maxPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('lot.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('lot.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .orderBy('lot.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'lot.id',
        'lease.id',
        'cell.id',
        'storage.id',
        'ownerCard.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'ownerCard.name',
        'ownerCard.color',
        'storage.name',
        'storage.x',
        'storage.y',
        'cell.name',
        'sellerCard.id',
        'sellerUser.id',
        'sellerUser.nick',
        'sellerUser.avatar',
        'sellerCard.name',
        'sellerCard.color',
        'lot.item',
        'lot.description',
        'lot.amount',
        'lot.intake',
        'lot.kit',
        'lot.price',
        'lot.createdAt',
        'lot.completedAt',
      ]);
  }
}
