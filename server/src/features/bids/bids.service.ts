import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Bid } from './bid.entity';
import { LotsService } from '../lots/lots.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateBidDto } from './bid.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { BidError } from './bid-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private bidsRepository: Repository<Bid>,
    private lotsService: LotsService,
    private mqttService: MqttService,
  ) {}

  async getMyBids(myId: number, req: Request): Promise<Response<Bid>> {
    const [result, count] = await this.getBidsQueryBuilder(req)
      .innerJoin('buyerCard.users', 'buyerUsers')
      .andWhere('buyerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getSoldBids(myId: number, req: Request): Promise<Response<Bid>> {
    const [result, count] = await this.getBidsQueryBuilder(req)
      .innerJoin('sellerCard.users', 'sellerUsers')
      .andWhere('sellerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedBids(myId: number, req: Request): Promise<Response<Bid>> {
    const [result, count] = await this.getBidsQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllBids(req: Request): Promise<Response<Bid>> {
    const [result, count] = await this.getBidsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createBid(dto: ExtCreateBidDto): Promise<void> {
    const lot = await this.lotsService.buyLot(dto);
    const bid = await this.create(dto);
    this.mqttService.publishNotificationMessage(
      lot.lease.card.userId,
      bid.id,
      Notification.CREATED_BID,
    );
  }

  async checkBidExists(id: number): Promise<void> {
    await this.bidsRepository.findOneByOrFail({ id });
  }

  private async create(dto: ExtCreateBidDto): Promise<Bid> {
    try {
      const bid = this.bidsRepository.create({
        lotId: dto.lotId,
        cardId: dto.cardId,
        price: dto.price,
      });
      await this.bidsRepository.save(bid);
      return bid;
    } catch (error) {
      throw new AppException(BidError.CREATE_FAILED);
    }
  }

  private getBidsQueryBuilder(req: Request): SelectQueryBuilder<Bid> {
    return this.bidsRepository
      .createQueryBuilder('bid')
      .innerJoin('bid.lot', 'lot')
      .innerJoin('lot.lease', 'lease')
      .innerJoin('lease.cell', 'cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('lease.card', 'sellerCard')
      .innerJoin('sellerCard.user', 'sellerUser')
      .innerJoin('bid.card', 'buyerCard')
      .innerJoin('buyerCard.user', 'buyerUser')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('bid.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.BUYER}`)
                  .andWhere('buyerUser.id = :userId'),
              ),
            )
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
                  .where(`${!req.mode || req.mode === Mode.BUYER}`)
                  .andWhere('buyerCard.id = :cardId'),
              ),
            )
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
            .orWhere('bid.price >= :minPrice', { minPrice: req.minPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('bid.price <= :maxPrice', { maxPrice: req.maxPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('bid.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('bid.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .orderBy('bid.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'bid.id',
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
        'buyerCard.id',
        'buyerUser.id',
        'buyerUser.nick',
        'buyerUser.avatar',
        'buyerCard.name',
        'buyerCard.color',
        'bid.price',
        'bid.createdAt',
      ]);
  }
}
