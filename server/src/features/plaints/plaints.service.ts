import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Plaint } from './plaint.entity';
import { Answer } from '../answers/answer.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeletePlaintDto,
  ExtCompletePlaintDto,
  ExtCreatePlaintDto,
  ExtEditPlaintDto,
} from './plaint.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { PlaintError } from './plaint-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class PlaintsService {
  constructor(
    @InjectRepository(Plaint)
    private plaintsRepository: Repository<Plaint>,
    private mqttService: MqttService,
  ) {}

  async getMainPlaints(req: Request): Promise<Response<Plaint>> {
    const [result, count] = await this.getPlaintsQueryBuilder(req)
      .andWhere('plaint.completedAt IS NULL')
      .getManyAndCount();
    return { result, count };
  }

  async getMyPlaints(myId: number, req: Request): Promise<Response<Plaint>> {
    const [result, count] = await this.getPlaintsQueryBuilder(req)
      .andWhere('senderUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getReceivedPlaints(
    myId: number,
    req: Request,
  ): Promise<Response<Plaint>> {
    const [result, count] = await this.getPlaintsQueryBuilder(req)
      .andWhere('receiverUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAnsweredPlaints(
    myId: number,
    req: Request,
  ): Promise<Response<Plaint>> {
    const [result, count] = await this.getPlaintsQueryBuilder(req)
      .innerJoinAndMapOne(
        'myAnswer',
        'plaint.answers',
        'myAnswer',
        'myAnswer.userId = :myId',
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getAllPlaints(req: Request): Promise<Response<Plaint>> {
    const [result, count] = await this.getPlaintsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async selectPlaintAnswers(plaintId: number): Promise<Answer[]> {
    const plaint = await this.plaintsRepository
      .createQueryBuilder('plaint')
      .leftJoin('plaint.answers', 'answer')
      .leftJoin('answer.reply', 'reply')
      .leftJoin('reply.user', 'replier')
      .leftJoin('answer.user', 'answerer')
      .where('plaint.id = :plaintId', { plaintId })
      .orderBy('answer.id', 'ASC')
      .select([
        'plaint.id',
        'answer.id',
        'reply.id',
        'replier.id',
        'replier.nick',
        'replier.avatar',
        'reply.text',
        'answerer.id',
        'answerer.nick',
        'answerer.avatar',
        'answer.text',
        'answer.createdAt',
      ])
      .getOne();
    return plaint.answers;
  }

  async createPlaint(
    dto: ExtCreatePlaintDto & { nick: string },
  ): Promise<void> {
    await this.create(dto);
    this.mqttService.publishNotificationMessage(
      dto.receiverUserId,
      dto.nick,
      Notification.CREATED_PLAINT,
    );
  }

  async editPlaint(dto: ExtEditPlaintDto): Promise<void> {
    const plaint = await this.checkPlaintSender(
      dto.plaintId,
      dto.myId,
      dto.hasRole,
    );
    await this.edit(plaint, dto);
  }

  async completePlaint(
    dto: ExtCompletePlaintDto & { nick: string },
  ): Promise<void> {
    const plaint = await this.checkPlaintNotCompleted(dto.plaintId);
    await this.complete(plaint, dto);
    [plaint.senderUserId, plaint.receiverUserId].forEach((userId) =>
      this.mqttService.publishNotificationMessage(
        userId,
        dto.nick,
        Notification.COMPLETED_PLAINT,
      ),
    );
    await this.mqttService.publishNotificationMention(
      dto.text,
      dto.nick,
      Notification.MENTIONED_PLAINT,
    );
  }

  async deletePlaint(dto: DeletePlaintDto & { nick: string }): Promise<void> {
    const plaint = await this.checkPlaintSender(
      dto.plaintId,
      dto.myId,
      dto.hasRole,
    );
    await this.delete(plaint);
    this.mqttService.publishNotificationMessage(
      plaint.receiverUserId,
      dto.nick,
      Notification.DELETED_PLAINT,
    );
  }

  async checkPlaintExists(id: number): Promise<void> {
    await this.plaintsRepository.findOneByOrFail({ id });
  }

  private async checkPlaintSender(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Plaint> {
    const plaint = await this.plaintsRepository.findOneBy({ id });
    if (plaint.senderUserId !== userId && !hasRole) {
      throw new AppException(PlaintError.NOT_SENDER);
    }
    if (plaint.completedAt) {
      throw new AppException(PlaintError.ALREADY_COMPLETED);
    }
    return plaint;
  }

  async checkPlaintNotCompleted(id: number): Promise<Plaint> {
    const plaint = await this.plaintsRepository.findOneBy({ id });
    if (plaint.completedAt) {
      throw new AppException(PlaintError.ALREADY_COMPLETED);
    }
    return plaint;
  }

  private async create(dto: ExtCreatePlaintDto): Promise<Plaint> {
    try {
      const plaint = this.plaintsRepository.create({
        title: dto.title,
        senderUserId: dto.senderUserId,
        receiverUserId: dto.receiverUserId,
      });
      await this.plaintsRepository.save(plaint);
      return plaint;
    } catch (error) {
      throw new AppException(PlaintError.CREATE_FAILED);
    }
  }

  private async edit(plaint: Plaint, dto: ExtEditPlaintDto): Promise<void> {
    try {
      plaint.title = dto.title;
      await this.plaintsRepository.save(plaint);
    } catch (error) {
      throw new AppException(PlaintError.EDIT_FAILED);
    }
  }

  private async complete(
    plaint: Plaint,
    dto: ExtCompletePlaintDto,
  ): Promise<void> {
    try {
      plaint.executorUserId = dto.myId;
      plaint.text = dto.text;
      plaint.completedAt = new Date();
      await this.plaintsRepository.save(plaint);
    } catch (error) {
      throw new AppException(PlaintError.COMPLETE_FAILED);
    }
  }

  private async delete(plaint: Plaint): Promise<void> {
    try {
      await this.plaintsRepository.remove(plaint);
    } catch (error) {
      throw new AppException(PlaintError.DELETE_FAILED);
    }
  }

  private getPlaintsQueryBuilder(req: Request): SelectQueryBuilder<Plaint> {
    return this.plaintsRepository
      .createQueryBuilder('plaint')
      .innerJoin('plaint.senderUser', 'senderUser')
      .innerJoin('plaint.receiverUser', 'receiverUser')
      .leftJoin('plaint.executorUser', 'executorUser')
      .loadRelationCountAndMap('plaint.answers', 'plaint.answers')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('plaint.id = :id', { id: req.id }),
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
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.EXECUTOR}`)
                  .andWhere('executorUser.id = :userId'),
              ),
            ),
        ),
        { userId: req.user },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.title}`)
            .orWhere('plaint.title ILIKE :title', { title: req.title }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('plaint.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('plaint.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .orderBy('plaint.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'plaint.id',
        'plaint.title',
        'senderUser.id',
        'senderUser.nick',
        'senderUser.avatar',
        'receiverUser.id',
        'receiverUser.nick',
        'receiverUser.avatar',
        'executorUser.id',
        'executorUser.nick',
        'executorUser.avatar',
        'plaint.text',
        'plaint.createdAt',
        'plaint.completedAt',
      ]);
  }
}
