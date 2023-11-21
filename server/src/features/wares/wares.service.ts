import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Ware } from './ware.entity';
import { WareState } from './ware-state.entity';
import { RentsService } from '../rents/rents.service';
import { PaymentsService } from '../payments/payments.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  BuyWareDto,
  CompleteWareDto,
  ExtCreateWareDto,
  ExtEditWareDto,
} from './ware.dto';
import { Request, Response, Stats } from '../../common/interfaces';
import { getDateMonthAgo, getDateWeekAgo } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { WareError } from './ware-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class WaresService {
  constructor(
    @InjectRepository(Ware)
    private waresRepository: Repository<Ware>,
    @InjectRepository(WareState)
    private waresStatesRepository: Repository<WareState>,
    private rentsService: RentsService,
    private paymentsService: PaymentsService,
    private mqttService: MqttService,
  ) {}

  async getWaresStats(): Promise<Stats> {
    const current = await this.waresRepository
      .createQueryBuilder('ware')
      .where('ware.createdAt >= :currentMonth', {
        currentMonth: getDateMonthAgo(1),
      })
      .getCount();
    const previous = await this.waresRepository
      .createQueryBuilder('ware')
      .where('ware.createdAt >= :previousMonth', {
        previousMonth: getDateMonthAgo(2),
      })
      .getCount();
    return { current, previous: previous - current };
  }

  async getMainWares(req: Request): Promise<Response<Ware>> {
    const [result, count] = await this.getWaresQueryBuilder(req)
      .andWhere('ware.amount > 0')
      .andWhere('rent.createdAt > :date', { date: getDateWeekAgo() })
      .getManyAndCount();
    await this.loadStatesAndRates(result);
    return { result, count };
  }

  async getMyWares(myId: number, req: Request): Promise<Response<Ware>> {
    const [result, count] = await this.getWaresQueryBuilder(req)
      .innerJoin('sellerCard.users', 'sellerUsers')
      .andWhere('sellerUsers.id = :myId', { myId })
      .getManyAndCount();
    await this.loadStatesAndRates(result);
    return { result, count };
  }

  async getPlacedWares(myId: number, req: Request): Promise<Response<Ware>> {
    const [result, count] = await this.getWaresQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    await this.loadStatesAndRates(result);
    return { result, count };
  }

  async getAllWares(req: Request): Promise<Response<Ware>> {
    const [result, count] = await this.getWaresQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadStatesAndRates(result);
    return { result, count };
  }

  async createWare(dto: ExtCreateWareDto): Promise<void> {
    await this.rentsService.checkRentOwner(dto.rentId, dto.myId, dto.hasRole);
    await this.create(dto);
  }

  async editWare(dto: ExtEditWareDto): Promise<void> {
    const ware = await this.checkWareOwner(dto.wareId, dto.myId, dto.hasRole);
    await this.edit(ware, dto);
  }

  async completeWare(dto: CompleteWareDto): Promise<void> {
    const ware = await this.checkWareOwner(dto.wareId, dto.myId, dto.hasRole);
    await this.complete(ware);
  }

  async buyWare(dto: BuyWareDto): Promise<void> {
    const ware = await this.waresRepository.findOne({
      relations: ['rent', 'rent.card'],
      where: { id: dto.wareId },
    });
    if (ware.createdAt < getDateWeekAgo()) {
      throw new AppException(WareError.ALREADY_EXPIRED);
    }
    if (ware.amount < dto.amount) {
      throw new AppException(WareError.NOT_ENOUGH_AMOUNT);
    }
    await this.paymentsService.createPayment({
      myId: dto.myId,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: ware.rent.cardId,
      sum: dto.amount * ware.price,
      description: 'buy ware',
    });
    await this.buy(ware, dto.amount);
    this.mqttService.publishNotificationMessage(
      ware.rent.card.userId,
      Notification.CREATED_TRADE,
    );
  }

  async checkWareExists(id: number): Promise<void> {
    await this.waresRepository.findOneByOrFail({ id });
  }

  async checkWareOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Ware> {
    const ware = await this.waresRepository.findOne({
      relations: ['rent', 'rent.card', 'rent.card.users'],
      where: { id },
    });
    if (
      !ware.rent.card.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
      throw new AppException(WareError.NOT_OWNER);
    }
    if (ware.createdAt < getDateWeekAgo()) {
      throw new AppException(WareError.ALREADY_EXPIRED);
    }
    if (ware.completedAt) {
      throw new AppException(WareError.ALREADY_COMPLETED);
    }
    return ware;
  }

  private async create(dto: ExtCreateWareDto): Promise<void> {
    try {
      const ware = this.waresRepository.create({
        rentId: dto.rentId,
        item: dto.item,
        description: dto.description,
        amount: dto.amount,
        intake: dto.intake,
        kit: dto.kit,
        price: dto.price,
      });
      await this.waresRepository.save(ware);
      const wareState = this.waresStatesRepository.create({
        wareId: ware.id,
        price: dto.price,
      });
      await this.waresStatesRepository.save(wareState);
    } catch (error) {
      throw new AppException(WareError.CREATE_FAILED);
    }
  }

  private async edit(ware: Ware, dto: ExtEditWareDto): Promise<void> {
    try {
      const equal = ware.price === dto.price;
      ware.amount = dto.amount;
      ware.price = dto.price;
      await this.waresRepository.save(ware);
      if (!equal) {
        const wareState = this.waresStatesRepository.create({
          wareId: ware.id,
          price: ware.price,
        });
        await this.waresStatesRepository.save(wareState);
      }
    } catch (error) {
      throw new AppException(WareError.EDIT_FAILED);
    }
  }

  private async complete(ware: Ware): Promise<void> {
    try {
      ware.amount = 0;
      ware.completedAt = new Date();
      await this.waresRepository.save(ware);
    } catch (error) {
      throw new AppException(WareError.COMPLETE_FAILED);
    }
  }

  private async buy(ware: Ware, amount: number): Promise<void> {
    try {
      ware.amount -= amount;
      await this.waresRepository.save(ware);
    } catch (error) {
      throw new AppException(WareError.BUY_FAILED);
    }
  }

  private async loadStatesAndRates(wares: Ware[]): Promise<void> {
    const promises = wares.map(async (ware) => {
      ware.states = (
        await this.waresRepository
          .createQueryBuilder('ware')
          .leftJoin('ware.states', 'state')
          .where('ware.id = :wareId', { wareId: ware.id })
          .orderBy('state.id', 'DESC')
          .select([
            'ware.id',
            'ware.price',
            'state.id',
            'state.price',
            'state.createdAt',
          ])
          .getOne()
      ).states;
      ware['rate'] = +(
        await this.waresRepository
          .createQueryBuilder('ware')
          .leftJoinAndMapMany(
            'ware.trades',
            'trades',
            'trade',
            'ware.id = trade.wareId',
          )
          .where('ware.id = :wareId', { wareId: ware.id })
          .select('AVG(trade.rate)', 'rate')
          .getRawOne()
      ).rate;
    });
    await Promise.all(promises);
  }

  private getWaresQueryBuilder(req: Request): SelectQueryBuilder<Ware> {
    return this.waresRepository
      .createQueryBuilder('ware')
      .innerJoin('ware.rent', 'rent')
      .innerJoin('rent.store', 'store')
      .innerJoin('store.market', 'market')
      .innerJoin('market.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('rent.card', 'sellerCard')
      .innerJoin('sellerCard.user', 'sellerUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.SELLER}`)
                  .andWhere('sellerUser.id = :userId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.OWNER}`)
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
                  .where(`${!req.mode || req.mode == Mode.SELLER}`)
                  .andWhere('sellerCard.id = :cardId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.OWNER}`)
                  .andWhere('ownerCard.id = :cardId'),
              ),
            ),
        ),
        { cardId: req.card },
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
          qb
            .where(`${!req.store}`)
            .orWhere('store.id = :storeId', { storeId: req.store }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.item}`)
            .orWhere('ware.item = :item', { item: req.item }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.description}`)
            .orWhere('ware.description ILIKE :description', {
              description: req.description,
            }),
        ),
      )
      .orderBy('ware.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'ware.id',
        'rent.id',
        'store.id',
        'market.id',
        'ownerCard.id',
        'ownerUser.id',
        'ownerUser.name',
        'ownerCard.name',
        'ownerCard.color',
        'market.name',
        'market.x',
        'market.y',
        'store.name',
        'sellerCard.id',
        'sellerUser.id',
        'sellerUser.name',
        'sellerCard.name',
        'sellerCard.color',
        'ware.item',
        'ware.description',
        'ware.amount',
        'ware.intake',
        'ware.kit',
        'ware.price',
        'ware.createdAt',
        'ware.completedAt',
      ]);
  }
}
