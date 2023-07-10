import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Rating } from './rating.entity';
import {
  DeleteRatingDto,
  ExtCreateRatingDto,
  ExtEditRatingDto,
} from './rating.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { RatingError } from './rating-error.enum';
import { Filter, Mode } from '../../common/enums';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
  ) {}

  async getMyRatings(myId: number, req: Request): Promise<Response<Rating>> {
    const [result, count] = await this.getRatingsQueryBuilder(req)
      .andWhere('senderUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPolledRatings(
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

  async createRating(dto: ExtCreateRatingDto): Promise<void> {
    const rating = await this.ratingsRepository.findOneBy({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
    if (!rating) {
      await this.create(dto);
    } else if (rating.rate) {
      await this.edit(rating, dto.rate);
    } else {
      await this.delete(rating);
    }
  }

  async editRating(dto: ExtEditRatingDto): Promise<void> {
    const rating = await this.checkRatingSender(dto.ratingId, dto.myId);
    if (dto.rate) {
      await this.edit(rating, dto.rate);
    } else {
      await this.delete(rating);
    }
  }

  async deleteRating(dto: DeleteRatingDto): Promise<void> {
    const rating = await this.checkRatingSender(dto.ratingId, dto.myId);
    await this.delete(rating);
  }

  async checkRatingExists(id: number): Promise<void> {
    await this.ratingsRepository.findOneByOrFail({ id });
  }

  private async checkRatingSender(
    id: number,
    senderUserId: number,
  ): Promise<Rating> {
    const rating = await this.ratingsRepository.findOneBy({ id, senderUserId });
    if (!rating) {
      throw new AppException(RatingError.NOT_SENDER);
    }
    return rating;
  }

  private async create(dto: ExtCreateRatingDto): Promise<void> {
    try {
      const rating = this.ratingsRepository.create({
        senderUserId: dto.myId,
        receiverUserId: dto.userId,
        rate: dto.rate,
      });
      await this.ratingsRepository.save(rating);
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
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.SOME}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes(Filter.SENDER)}`)
                              .andWhere('senderUser.id = :userId'),
                          ),
                        )
                        .orWhere(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes(Filter.RECEIVER)}`)
                              .andWhere('receiverUser.id = :userId'),
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
                        .where(`${!req.filters.includes(Filter.SENDER)}`)
                        .orWhere('senderUser.id = :userId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.RECEIVER)}`)
                        .orWhere('receiverUser.id = :userId'),
                    ),
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.ONLY}`)
                  .andWhere(
                    `senderUser.id ${
                      req.filters.includes(Filter.SENDER) ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `receiverUser.id ${
                      req.filters.includes(Filter.RECEIVER) ? '=' : '!='
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
            .where(`${!req.rate}`)
            .orWhere('rating.rate = :rate', { rate: req.rate }),
        ),
      )
      .orderBy('rating.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'rating.id',
        'senderUser.id',
        'senderUser.name',
        'senderUser.status',
        'receiverUser.id',
        'receiverUser.name',
        'receiverUser.status',
        'rating.rate',
        'rating.createdAt',
      ]);
  }
}
