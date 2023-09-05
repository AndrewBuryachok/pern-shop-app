import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Bid } from './bid.entity';
import { LotsService } from '../lots/lots.service';
import { ExtCreateBidDto } from './bid.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { BidError } from './bid-error.enum';
import { Filter, Mode } from '../../common/enums';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private bidsRepository: Repository<Bid>,
    private lotsService: LotsService,
  ) {}

  async getMyBids(myId: number, req: Request): Promise<Response<Bid>> {
    const [result, count] = await this.getBidsQueryBuilder(req)
      .innerJoin('buyerCard.users', 'buyerUsers')
      .innerJoin('sellerCard.users', 'sellerUsers')
      .andWhere(
        new Brackets((qb) =>
          qb.where('buyerUsers.id = :myId').orWhere('sellerUsers.id = :myId'),
        ),
        { myId },
      )
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
    await this.lotsService.buyLot(dto);
    await this.create(dto);
  }

  async checkBidExists(id: number): Promise<void> {
    await this.bidsRepository.findOneByOrFail({ id });
  }

  private async create(dto: ExtCreateBidDto): Promise<void> {
    try {
      const bid = this.bidsRepository.create({
        lotId: dto.lotId,
        cardId: dto.cardId,
        price: dto.price,
      });
      await this.bidsRepository.save(bid);
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
                            .where(`${req.filters.includes(Filter.BUYER)}`)
                            .andWhere('buyerUser.id = :userId'),
                        ),
                      )
                      .orWhere(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.SELLER)}`)
                            .andWhere('sellerUser.id = :userId'),
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
                        .where(`${!req.filters.includes(Filter.BUYER)}`)
                        .orWhere('buyerUser.id = :userId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.SELLER)}`)
                        .orWhere('sellerUser.id = :userId'),
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
                    `buyerUser.id ${
                      req.filters.includes(Filter.BUYER) ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `sellerUser.id ${
                      req.filters.includes(Filter.SELLER) ? '=' : '!='
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
            .where(`${!req.card}`)
            .orWhere(
              new Brackets((qb) =>
                qb.where(`${req.mode === Mode.SOME}`).andWhere(
                  new Brackets((qb) =>
                    qb
                      .where(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.BUYER)}`)
                            .andWhere('buyerCard.id = :cardId'),
                        ),
                      )
                      .orWhere(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.SELLER)}`)
                            .andWhere('sellerCard.id = :cardId'),
                        ),
                      )
                      .orWhere(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.OWNER)}`)
                            .andWhere('ownerCard.id = :cardId'),
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
                        .where(`${!req.filters.includes(Filter.BUYER)}`)
                        .orWhere('buyerCard.id = :cardId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.SELLER)}`)
                        .orWhere('sellerCard.id = :cardId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.OWNER)}`)
                        .orWhere('ownerCard.id = :cardId'),
                    ),
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.ONLY}`)
                  .andWhere(
                    `buyerCard.id ${
                      req.filters.includes(Filter.BUYER) ? '=' : '!='
                    } :cardId`,
                  )
                  .andWhere(
                    `sellerCard.id ${
                      req.filters.includes(Filter.SELLER) ? '=' : '!='
                    } :cardId`,
                  )
                  .andWhere(
                    `ownerCard.id ${
                      req.filters.includes(Filter.OWNER) ? '=' : '!='
                    } :cardId`,
                  ),
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
        'ownerUser.name',
        'ownerUser.status',
        'ownerCard.name',
        'ownerCard.color',
        'storage.name',
        'storage.x',
        'storage.y',
        'cell.name',
        'sellerCard.id',
        'sellerUser.id',
        'sellerUser.name',
        'sellerUser.status',
        'sellerCard.name',
        'sellerCard.color',
        'lot.item',
        'lot.description',
        'lot.amount',
        'lot.intake',
        'lot.kit',
        'buyerCard.id',
        'buyerUser.id',
        'buyerUser.name',
        'buyerUser.status',
        'buyerCard.name',
        'buyerCard.color',
        'bid.price',
        'bid.createdAt',
      ]);
  }
}
