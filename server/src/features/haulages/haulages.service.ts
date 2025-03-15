import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { Haulage } from './haulage.entity';
import { HiresService } from '../hires/hires.service';
import { CardsService } from '../cards/cards.service';
import { PaymentsService } from '../payments/payments.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ExtCreateHaulageDto,
  ExtEditHaulageDto,
  ExtHaulageIdDto,
  ExtRateHaulageDto,
  ExtTakeHaulageDto,
} from './haulage.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { HaulageError } from './haulage-error.enum';
import { Status } from '../transportations/status.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class HaulagesService {
  constructor(
    @InjectRepository(Haulage)
    private haulagesRepository: Repository<Haulage>,
    private hiresService: HiresService,
    private cardsService: CardsService,
    private paymentsService: PaymentsService,
    private mqttService: MqttService,
  ) {}

  async getMainHaulages(req: Request): Promise<Response<Haulage>> {
    const [result, count] = await this.getHaulagesQueryBuilder(req)
      .andWhere('haulage.status = :status', {
        status: Status.CREATED,
      })
      .andWhere('fromHire.completedAt > NOW()')
      .andWhere('toHire.completedAt > NOW()')
      .getManyAndCount();
    return { result, count };
  }

  async getMyHaulages(myId: number, req: Request): Promise<Response<Haulage>> {
    const [result, count] = await this.getHaulagesQueryBuilder(req)
      .innerJoin('customerAccount.cards', 'customerCards')
      .andWhere('customerCards.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getTakenHaulages(
    myId: number,
    req: Request,
  ): Promise<Response<Haulage>> {
    const [result, count] = await this.getHaulagesQueryBuilder(req)
      .leftJoin('executorAccount.cards', 'executorCards')
      .andWhere('executorCards.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedHaulages(
    myId: number,
    req: Request,
  ): Promise<Response<Haulage>> {
    const [result, count] = await this.getHaulagesQueryBuilder(req)
      .innerJoin('fromOwnerAccount.cards', 'fromOwnerCards')
      .innerJoin('toOwnerAccount.cards', 'toOwnerCards')
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('fromOwnerCards.userId = :myId')
            .orWhere('toOwnerCards.userId = :myId'),
        ),
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getAllHaulages(req: Request): Promise<Response<Haulage>> {
    const [result, count] = await this.getHaulagesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createHaulage(
    dto: ExtCreateHaulageDto & { nick: string },
  ): Promise<void> {
    const fromHireId = await this.hiresService.createHire({
      ...dto,
      stationId: dto.fromStationId,
    });
    const toHireId = await this.hiresService.createHire({
      ...dto,
      stationId: dto.toStationId,
    });
    await this.cardsService.decreaseCardBalance({ ...dto, sum: dto.price });
    const haulage = await this.create({
      ...dto,
      fromStationId: fromHireId,
      toStationId: toHireId,
    });
    this.mqttService.publishNotification(
      haulage.id,
      0,
      dto.nick,
      Notification.CREATED_HAULAGE,
    );
  }

  async editHaulage(dto: ExtEditHaulageDto): Promise<void> {
    const haulage = await this.checkHaulageCustomer(
      dto.haulageId,
      dto.myId,
      dto.hasRole,
    );
    if (haulage.status !== Status.CREATED) {
      throw new AppException(HaulageError.ALREADY_TAKEN);
    }
    if (dto.price !== haulage.price) {
      if (dto.price < haulage.price) {
        await this.cardsService.increaseCardBalance({
          cardId: haulage.fromHire.cardId,
          sum: haulage.price - dto.price,
        });
      } else {
        await this.cardsService.decreaseCardBalance({
          cardId: haulage.fromHire.cardId,
          sum: dto.price - haulage.price,
        });
      }
    }
    await this.edit(haulage, dto);
  }

  async takeHaulage(dto: ExtTakeHaulageDto & { nick: string }): Promise<void> {
    await this.cardsService.checkCardUser(dto.cardId, dto.myId, dto.hasRole);
    const haulage = await this.haulagesRepository.findOne({
      relations: ['fromHire', 'fromHire.card', 'toHire'],
      where: { id: dto.haulageId },
    });
    if (haulage.status !== Status.CREATED) {
      throw new AppException(HaulageError.ALREADY_TAKEN);
    }
    if (
      haulage.fromHire.completedAt < new Date() ||
      haulage.toHire.completedAt < new Date()
    ) {
      throw new AppException(HaulageError.ALREADY_EXPIRED);
    }
    await this.take(haulage, dto.cardId);
    this.mqttService.publishNotification(
      dto.haulageId,
      haulage.fromHire.card.userId,
      dto.nick,
      Notification.TAKEN_HAULAGE,
    );
  }

  async untakeHaulage(dto: ExtHaulageIdDto & { nick: string }): Promise<void> {
    const haulage = await this.checkHaulageExecutor(
      dto.haulageId,
      dto.myId,
      dto.hasRole,
    );
    if (haulage.status !== Status.TAKEN) {
      throw new AppException(HaulageError.NOT_TAKEN);
    }
    await this.untake(haulage);
    this.mqttService.publishNotification(
      dto.haulageId,
      haulage.fromHire.card.userId,
      dto.nick,
      Notification.UNTAKEN_HAULAGE,
    );
  }

  async executeHaulage(dto: ExtHaulageIdDto & { nick: string }): Promise<void> {
    const haulage = await this.checkHaulageExecutor(
      dto.haulageId,
      dto.myId,
      dto.hasRole,
    );
    if (haulage.status !== Status.TAKEN) {
      throw new AppException(HaulageError.NOT_TAKEN);
    }
    await this.execute(haulage);
    this.mqttService.publishNotification(
      dto.haulageId,
      haulage.fromHire.card.userId,
      dto.nick,
      Notification.EXECUTED_HAULAGE,
    );
  }

  async completeHaulage(
    dto: ExtHaulageIdDto & { nick: string },
  ): Promise<void> {
    const haulage = await this.checkHaulageCustomer(
      dto.haulageId,
      dto.myId,
      dto.hasRole,
    );
    if (haulage.status !== Status.EXECUTED) {
      throw new AppException(HaulageError.NOT_EXECUTED);
    }
    await this.cardsService.increaseCardBalance({
      cardId: haulage.fromHire.cardId,
      sum: haulage.price,
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: haulage.fromHire.cardId,
      receiverCardId: haulage.executorCardId,
      sum: haulage.price,
      description: '',
    });
    try {
      await this.hiresService.completeHire({
        ...dto,
        hireId: haulage.fromHireId,
      });
    } catch (error) {}
    try {
      await this.hiresService.completeHire({
        ...dto,
        hireId: haulage.toHireId,
      });
    } catch (error) {}
    await this.complete(haulage);
    this.unpublishNotification(dto.haulageId, dto.nick);
    this.mqttService.publishNotification(
      dto.haulageId,
      haulage.executorCard.userId,
      dto.nick,
      Notification.COMPLETED_HAULAGE,
    );
  }

  async deleteHaulage(dto: ExtHaulageIdDto & { nick: string }): Promise<void> {
    const haulage = await this.checkHaulageCustomer(
      dto.haulageId,
      dto.myId,
      dto.hasRole,
    );
    if (haulage.status !== Status.CREATED) {
      throw new AppException(HaulageError.ALREADY_TAKEN);
    }
    await this.cardsService.increaseCardBalance({
      cardId: haulage.fromHire.cardId,
      sum: haulage.price,
    });
    try {
      await this.hiresService.completeHire({
        ...dto,
        hireId: haulage.fromHireId,
      });
    } catch (error) {}
    try {
      await this.hiresService.completeHire({
        ...dto,
        hireId: haulage.toHireId,
      });
    } catch (error) {}
    await this.delete(haulage);
    this.unpublishNotification(dto.haulageId, dto.nick);
  }

  async rateHaulage(dto: ExtRateHaulageDto & { nick: string }): Promise<void> {
    const haulage = await this.checkHaulageCustomer(
      dto.haulageId,
      dto.myId,
      dto.hasRole,
    );
    if (haulage.status !== Status.COMPLETED) {
      throw new AppException(HaulageError.NOT_COMPLETED);
    }
    await this.rate(haulage, dto.rate);
    this.mqttService.publishNotification(
      dto.haulageId,
      haulage.executorCard.userId,
      dto.nick,
      Notification.RATED_HAULAGE,
    );
  }

  async checkHaulageExists(id: number): Promise<void> {
    await this.haulagesRepository.findOneByOrFail({ id });
  }

  private async checkHaulageCustomer(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Haulage> {
    const haulage = await this.haulagesRepository.findOne({
      relations: [
        'fromHire',
        'fromHire.card',
        'fromHire.card.account',
        'fromHire.card.account.cards',
        'executorCard',
      ],
      where: {
        id,
        fromHire: { card: { account: { cards: { completedAt: IsNull() } } } },
      },
    });
    const card = haulage.fromHire.card.account.cards.find(
      (card) => card.userId === userId,
    );
    if (!card && !hasRole) {
      throw new AppException(HaulageError.NOT_CUSTOMER);
    }
    return haulage;
  }

  private async checkHaulageExecutor(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Haulage> {
    const haulage = await this.haulagesRepository.findOne({
      relations: [
        'executorCard',
        'executorCard.account',
        'executorCard.account.cards',
        'fromHire',
        'fromHire.card',
      ],
      where: {
        id,
        executorCard: { account: { cards: { completedAt: IsNull() } } },
      },
    });
    const card = haulage.executorCard.account.cards.find(
      (card) => card.userId === userId,
    );
    if (!card && !hasRole) {
      throw new AppException(HaulageError.NOT_EXECUTOR);
    }
    return haulage;
  }

  private async create(dto: ExtCreateHaulageDto): Promise<Haulage> {
    try {
      const haulage = this.haulagesRepository.create({
        fromHireId: dto.fromStationId,
        toHireId: dto.toStationId,
        item: dto.item,
        description: dto.description,
        amount: dto.amount,
        intake: dto.intake,
        kit: dto.kit,
        price: dto.price,
      });
      await this.haulagesRepository.save(haulage);
      return haulage;
    } catch (error) {
      throw new AppException(HaulageError.CREATE_FAILED);
    }
  }

  private async edit(haulage: Haulage, dto: ExtEditHaulageDto): Promise<void> {
    try {
      haulage.item = dto.item;
      haulage.description = dto.description;
      haulage.amount = dto.amount;
      haulage.intake = dto.intake;
      haulage.kit = dto.kit;
      haulage.price = dto.price;
      await this.haulagesRepository.save(haulage);
    } catch (error) {
      throw new AppException(HaulageError.EDIT_FAILED);
    }
  }

  private async take(haulage: Haulage, cardId: number): Promise<void> {
    try {
      haulage.executorCardId = cardId;
      haulage.status = Status.TAKEN;
      await this.haulagesRepository.save(haulage);
    } catch (error) {
      throw new AppException(HaulageError.TAKE_FAILED);
    }
  }

  private async untake(haulage: Haulage): Promise<void> {
    try {
      haulage.executorCard = null;
      haulage.executorCardId = null;
      haulage.status = Status.CREATED;
      await this.haulagesRepository.save(haulage);
    } catch (error) {
      throw new AppException(HaulageError.UNTAKE_FAILED);
    }
  }

  private async execute(haulage: Haulage): Promise<void> {
    try {
      haulage.status = Status.EXECUTED;
      await this.haulagesRepository.save(haulage);
    } catch (error) {
      throw new AppException(HaulageError.EXECUTE_FAILED);
    }
  }

  private async complete(haulage: Haulage): Promise<void> {
    try {
      haulage.completedAt = new Date();
      haulage.status = Status.COMPLETED;
      await this.haulagesRepository.save(haulage);
    } catch (error) {
      throw new AppException(HaulageError.COMPLETE_FAILED);
    }
  }

  private async delete(haulage: Haulage): Promise<void> {
    try {
      await this.haulagesRepository.remove(haulage);
    } catch (error) {
      throw new AppException(HaulageError.DELETE_FAILED);
    }
  }

  private async rate(haulage: Haulage, rate: number): Promise<void> {
    try {
      haulage.rate = rate;
      await this.haulagesRepository.save(haulage);
    } catch (error) {
      throw new AppException(HaulageError.RATE_FAILED);
    }
  }

  private unpublishNotification(id: number, nick: string): void {
    this.mqttService.unpublishNotification(
      id,
      0,
      nick,
      Notification.CREATED_HAULAGE,
    );
  }

  private getHaulagesQueryBuilder(req: Request): SelectQueryBuilder<Haulage> {
    return this.haulagesRepository
      .createQueryBuilder('haulage')
      .innerJoin('haulage.fromHire', 'fromHire')
      .innerJoin('fromHire.box', 'fromBox')
      .innerJoin('fromBox.station', 'fromStation')
      .innerJoin('fromStation.card', 'fromOwnerCard')
      .innerJoin('fromOwnerCard.account', 'fromOwnerAccount')
      .innerJoin('fromOwnerCard.user', 'fromOwnerUser')
      .innerJoin('haulage.toHire', 'toHire')
      .innerJoin('toHire.box', 'toBox')
      .innerJoin('toBox.station', 'toStation')
      .innerJoin('toStation.card', 'toOwnerCard')
      .innerJoin('toOwnerCard.account', 'toOwnerAccount')
      .innerJoin('toOwnerCard.user', 'toOwnerUser')
      .innerJoin('fromHire.card', 'customerCard')
      .innerJoin('customerCard.account', 'customerAccount')
      .innerJoin('customerCard.user', 'customerUser')
      .leftJoin('haulage.executorCard', 'executorCard')
      .leftJoin('executorCard.account', 'executorAccount')
      .leftJoin('executorCard.user', 'executorUser')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('haulage.id = :id', { id: req.id }),
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
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.OWNER}`)
                  .andWhere(
                    'fromOwnerUser.id = :userId OR toOwnerUser.id = :userId',
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
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.OWNER}`)
                  .andWhere(
                    'fromOwnerCard.id = :cardId OR toOwnerCard.id = :cardId',
                  ),
              ),
            ),
        ),
        { cardId: req.card },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.station}`, { stationId: req.station })
            .orWhere('fromStation.id = :stationId')
            .orWhere('toStation.id = :stationId'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.box}`, { boxId: req.box })
            .orWhere('fromBox.id = :boxId')
            .orWhere('toBox.id = :boxId'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.item}`)
            .orWhere('haulage.item = :item', { item: req.item }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.description}`)
            .orWhere('haulage.description ILIKE :description', {
              description: req.description,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minAmount}`)
            .orWhere('haulage.amount >= :minAmount', {
              minAmount: req.minAmount,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxAmount}`)
            .orWhere('haulage.amount <= :maxAmount', {
              maxAmount: req.maxAmount,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minIntake}`)
            .orWhere('haulage.intake >= :minIntake', {
              minIntake: req.minIntake,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxIntake}`)
            .orWhere('haulage.intake <= :maxIntake', {
              maxIntake: req.maxIntake,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.kit}`)
            .orWhere('haulage.kit = :kit', { kit: req.kit }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minPrice}`)
            .orWhere('haulage.price >= :minPrice', { minPrice: req.minPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('haulage.price <= :maxPrice', { maxPrice: req.maxPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.status}`)
            .orWhere('haulage.status = :status', { status: req.status }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.rate}`)
            .orWhere('haulage.rate = :rate', { rate: req.rate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.minDate}`).orWhere('haulage.createdAt >= :minDate', {
            minDate: req.minDate,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.maxDate}`).orWhere('haulage.createdAt <= :maxDate', {
            maxDate: req.maxDate,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== 1}`)
            .orWhere('haulage.completedAt IS NOT NULL')
            .orWhere('fromHire.completedAt < NOW()')
            .orWhere('toHire.completedAt < NOW()'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== -1}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where('haulage.completedAt IS NULL')
                  .andWhere('fromHire.completedAt > NOW()')
                  .andWhere('toHire.completedAt > NOW()'),
              ),
            ),
        ),
      )
      .orderBy('haulage.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'haulage.id',
        'fromHire.id',
        'fromBox.id',
        'fromStation.id',
        'fromOwnerCard.id',
        'fromOwnerAccount.id',
        'fromOwnerAccount.name',
        'fromOwnerAccount.color',
        'fromOwnerUser.id',
        'fromOwnerUser.nick',
        'fromOwnerUser.avatar',
        'fromStation.name',
        'fromStation.x',
        'fromStation.y',
        'fromBox.name',
        'toHire.id',
        'toBox.id',
        'toStation.id',
        'toOwnerCard.id',
        'toOwnerAccount.id',
        'toOwnerAccount.name',
        'toOwnerAccount.color',
        'toOwnerUser.id',
        'toOwnerUser.nick',
        'toOwnerUser.avatar',
        'toStation.name',
        'toStation.x',
        'toStation.y',
        'toBox.name',
        'customerCard.id',
        'customerAccount.id',
        'customerAccount.name',
        'customerAccount.color',
        'customerUser.id',
        'customerUser.nick',
        'customerUser.avatar',
        'haulage.item',
        'haulage.description',
        'haulage.amount',
        'haulage.intake',
        'haulage.kit',
        'haulage.price',
        'haulage.status',
        'executorCard.id',
        'executorAccount.id',
        'executorAccount.name',
        'executorAccount.color',
        'executorUser.id',
        'executorUser.nick',
        'executorUser.avatar',
        'haulage.createdAt',
        'haulage.completedAt',
        'haulage.rate',
      ]);
  }
}
