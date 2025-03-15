import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { Advert } from './advert.entity';
import { Task } from '../tasks/task.entity';
import { CardsService } from '../cards/cards.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeleteAdvertDto,
  ExtCreateAdvertDto,
  ExtEditAdvertDto,
  ExtRespondAdvertDto,
} from './advert.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { AdvertError } from './advert-error.enum';
import { Status } from '../transportations/status.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class AdvertsService {
  constructor(
    @InjectRepository(Advert)
    private advertsRepository: Repository<Advert>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private cardsService: CardsService,
    private mqttService: MqttService,
  ) {}

  async getMainAdverts(req: Request): Promise<Response<Advert>> {
    const [result, count] = await this.getAdvertsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyAdverts(myId: number, req: Request): Promise<Response<Advert>> {
    const [result, count] = await this.getAdvertsQueryBuilder(req)
      .innerJoin('ownerAccount.cards', 'ownerCards')
      .andWhere('ownerCards.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllAdverts(req: Request): Promise<Response<Advert>> {
    const [result, count] = await this.getAdvertsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createAdvert(
    dto: ExtCreateAdvertDto & { nick: string },
  ): Promise<void> {
    await this.cardsService.checkCardUser(dto.cardId, dto.myId, dto.hasRole);
    const advert = await this.create(dto);
    this.mqttService.publishNotification(
      advert.id,
      0,
      dto.nick,
      Notification.CREATED_ADVERT,
    );
  }

  async editAdvert(dto: ExtEditAdvertDto): Promise<void> {
    const advert = await this.checkAdvertOwner(
      dto.advertId,
      dto.myId,
      dto.hasRole,
    );
    await this.edit(advert, dto);
  }

  async deleteAdvert(dto: DeleteAdvertDto & { nick: string }): Promise<void> {
    const advert = await this.checkAdvertOwner(
      dto.advertId,
      dto.myId,
      dto.hasRole,
    );
    await this.delete(advert);
    this.mqttService.unpublishNotification(
      dto.advertId,
      0,
      dto.nick,
      Notification.CREATED_ADVERT,
    );
  }

  async respondAdvert(
    dto: ExtRespondAdvertDto & { nick: string },
  ): Promise<void> {
    await this.cardsService.checkCardUser(dto.cardId, dto.myId, dto.hasRole);
    await this.cardsService.decreaseCardBalance({ ...dto, sum: dto.price });
    const advert = await this.advertsRepository.findOne({
      relations: ['card'],
      where: { id: dto.advertId },
    });
    const task = await this.respond(dto, advert.cardId);
    this.mqttService.publishNotification(
      task.id,
      advert.card.userId,
      dto.nick,
      Notification.RESPONDED_ADVERT,
    );
  }

  async checkAdvertExists(id: number): Promise<void> {
    await this.advertsRepository.findOneByOrFail({ id });
  }

  async checkAdvertOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Advert> {
    const advert = await this.advertsRepository.findOne({
      relations: ['card', 'card.account', 'card.account.cards'],
      where: { id, card: { account: { cards: { completedAt: IsNull() } } } },
    });
    const card = advert.card.account.cards.find(
      (card) => card.userId === userId,
    );
    if (!card && !hasRole) {
      throw new AppException(AdvertError.NOT_OWNER);
    }
    return advert;
  }

  private async create(dto: ExtCreateAdvertDto): Promise<Advert> {
    try {
      const advert = this.advertsRepository.create({
        cardId: dto.cardId,
        activity: dto.activity,
        text: dto.text,
        price: dto.price,
      });
      await this.advertsRepository.save(advert);
      return advert;
    } catch (error) {
      throw new AppException(AdvertError.CREATE_FAILED);
    }
  }

  private async edit(advert: Advert, dto: ExtEditAdvertDto): Promise<void> {
    try {
      advert.activity = dto.activity;
      advert.text = dto.text;
      advert.price = dto.price;
      await this.advertsRepository.save(advert);
    } catch (error) {
      throw new AppException(AdvertError.EDIT_FAILED);
    }
  }

  private async delete(advert: Advert): Promise<void> {
    try {
      await this.advertsRepository.remove(advert);
    } catch (error) {
      throw new AppException(AdvertError.DELETE_FAILED);
    }
  }

  private async respond(
    dto: ExtRespondAdvertDto,
    cardId: number,
  ): Promise<Task> {
    try {
      const task = this.tasksRepository.create({
        customerCardId: dto.cardId,
        activity: dto.activity,
        text: dto.text,
        price: dto.price,
        status: Status.TAKEN,
        executorCardId: cardId,
      });
      await this.tasksRepository.save(task);
      return task;
    } catch (error) {
      throw new AppException(AdvertError.CREATE_FAILED);
    }
  }

  private getAdvertsQueryBuilder(req: Request): SelectQueryBuilder<Advert> {
    return this.advertsRepository
      .createQueryBuilder('advert')
      .innerJoin('advert.card', 'ownerCard')
      .innerJoin('ownerCard.account', 'ownerAccount')
      .innerJoin('ownerCard.user', 'ownerUser')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('advert.id = :id', { id: req.id }),
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
            .where(`${!req.activity}`)
            .orWhere('advert.activity ILIKE :activity', {
              activity: req.activity,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minPrice}`)
            .orWhere('advert.price >= :minPrice', { minPrice: req.minPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('advert.price <= :maxPrice', { maxPrice: req.maxPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('advert.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('advert.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .orderBy('advert.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'advert.id',
        'ownerCard.id',
        'ownerAccount.id',
        'ownerAccount.name',
        'ownerAccount.color',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'advert.activity',
        'advert.text',
        'advert.price',
        'advert.createdAt',
      ]);
  }
}
