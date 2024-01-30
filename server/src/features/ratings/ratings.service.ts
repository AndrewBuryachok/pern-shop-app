import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Rating } from './rating.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeleteRatingDto,
  ExtCreateRatingDto,
  ExtEditRatingDto,
} from './rating.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { RatingError } from './rating-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
    private mqttService: MqttService,
  ) {}

  async getMyRatings(myId: number, req: Request): Promise<Response<Rating>> {
    const [result, count] = await this.getRatingsQueryBuilder(req)
      .andWhere('senderUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getReceivedRatings(
    myId: number,
    req: Request,
  ): Promise<Response<Rating>> {
    const [result, count] = await this.getRatingsQueryBuilder(req)
      .andWhere('receiverUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllRatings(req: Request): Promise<Response<Rating>> {
    const [result, count] = await this.getRatingsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createRating(
    dto: ExtCreateRatingDto & { nick: string },
  ): Promise<void> {
    if (dto.senderUserId === dto.receiverUserId) {
      throw new AppException(RatingError.SENDER);
    }
    const rating = await this.ratingsRepository.findOneBy({
      senderUserId: dto.senderUserId,
      receiverUserId: dto.receiverUserId,
    });
    if (rating) {
      throw new AppException(RatingError.ALREADY_HAS_RATING);
    }
    await this.create(dto);
    this.mqttService.publishNotificationMessage(
      dto.receiverUserId,
      dto.nick,
      Notification.CREATED_RATING,
    );
  }

  async editRating(dto: ExtEditRatingDto & { nick: string }): Promise<void> {
    const rating = await this.checkRatingSender(
      dto.ratingId,
      dto.myId,
      dto.hasRole,
    );
    await this.edit(rating, dto.rate);
    this.mqttService.publishNotificationMessage(
      rating.receiverUserId,
      dto.nick,
      Notification.EDITED_RATING,
    );
  }

  async deleteRating(dto: DeleteRatingDto & { nick: string }): Promise<void> {
    const rating = await this.checkRatingSender(
      dto.ratingId,
      dto.myId,
      dto.hasRole,
    );
    await this.delete(rating);
    this.mqttService.publishNotificationMessage(
      rating.receiverUserId,
      dto.nick,
      Notification.DELETED_RATING,
    );
  }

  async checkRatingExists(id: number): Promise<void> {
    await this.ratingsRepository.findOneByOrFail({ id });
  }

  private async checkRatingSender(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Rating> {
    const rating = await this.ratingsRepository.findOneBy({ id });
    if (rating.senderUserId !== userId && !hasRole) {
      throw new AppException(RatingError.NOT_SENDER);
    }
    return rating;
  }

  private async create(dto: ExtCreateRatingDto): Promise<Rating> {
    try {
      const rating = this.ratingsRepository.create({
        senderUserId: dto.senderUserId,
        receiverUserId: dto.receiverUserId,
        rate: dto.rate,
      });
      await this.ratingsRepository.save(rating);
      return rating;
    } catch (error) {
      throw new AppException(RatingError.CREATE_FAILED);
    }
  }

  private async edit(rating: Rating, rate: number): Promise<void> {
    try {
      rating.rate = rate;
      await this.ratingsRepository.save(rating);
    } catch (error) {
      throw new AppException(RatingError.EDIT_FAILED);
    }
  }

  private async delete(rating: Rating): Promise<void> {
    try {
      await this.ratingsRepository.remove(rating);
    } catch (error) {
      throw new AppException(RatingError.DELETE_FAILED);
    }
  }

  private getRatingsQueryBuilder(req: Request): SelectQueryBuilder<Rating> {
    return this.ratingsRepository
      .createQueryBuilder('rating')
      .innerJoin('rating.senderUser', 'senderUser')
      .innerJoin('rating.receiverUser', 'receiverUser')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('rating.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.SENDER}`)
                  .andWhere('senderUser.id = :userId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.RECEIVER}`)
                  .andWhere('receiverUser.id = :userId'),
              ),
            ),
        ),
        { userId: req.user },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.rate}`)
            .orWhere('rating.rate = :rate', { rate: req.rate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('rating.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('rating.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .orderBy('rating.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'rating.id',
        'senderUser.id',
        'senderUser.nick',
        'senderUser.avatar',
        'receiverUser.id',
        'receiverUser.nick',
        'receiverUser.avatar',
        'rating.rate',
        'rating.createdAt',
      ]);
  }
}
