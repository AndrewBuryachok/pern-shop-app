import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Plaint } from './plaint.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeletePlaintDto,
  ExtCreatePlaintDto,
  ExtUpdatePlaintDto,
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

  async getAllPlaints(req: Request): Promise<Response<Plaint>> {
    const [result, count] = await this.getPlaintsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createPlaint(dto: ExtCreatePlaintDto): Promise<void> {
    await this.create(dto);
    this.mqttService.publishNotificationMessage(
      dto.userId,
      Notification.CREATED_PLAINT,
    );
  }

  async executePlaint(dto: ExtUpdatePlaintDto): Promise<void> {
    const plaint = await this.checkPlaintReceiver(dto.plaintId, dto.myId);
    if (plaint.executedAt) {
      throw new AppException(PlaintError.ALREADY_EXECUTED);
    }
    if (plaint.completedAt) {
      throw new AppException(PlaintError.ALREADY_COMPLETED);
    }
    await this.execute(plaint, dto);
    this.mqttService.publishNotificationMessage(
      plaint.senderUserId,
      Notification.EXECUTED_PLAINT,
    );
  }

  async completePlaint(dto: ExtUpdatePlaintDto): Promise<void> {
    const plaint = await this.plaintsRepository.findOneBy({ id: dto.plaintId });
    if (plaint.completedAt) {
      throw new AppException(PlaintError.ALREADY_COMPLETED);
    }
    await this.complete(plaint, dto);
    [plaint.senderUserId, plaint.receiverUserId].forEach((userId) =>
      this.mqttService.publishNotificationMessage(
        userId,
        Notification.COMPLETED_PLAINT,
      ),
    );
  }

  async deletePlaint(dto: DeletePlaintDto): Promise<void> {
    const plaint = await this.checkPlaintSender(dto.plaintId, dto.myId);
    if (plaint.executedAt) {
      throw new AppException(PlaintError.ALREADY_EXECUTED);
    }
    if (plaint.executedAt) {
      throw new AppException(PlaintError.ALREADY_COMPLETED);
    }
    await this.delete(plaint);
    this.mqttService.publishNotificationMessage(
      plaint.receiverUserId,
      Notification.DELETED_PLAINT,
    );
  }

  async checkPlaintExists(id: number): Promise<void> {
    await this.plaintsRepository.findOneByOrFail({ id });
  }

  private async checkPlaintSender(
    id: number,
    senderUserId: number,
  ): Promise<Plaint> {
    const plaint = await this.plaintsRepository.findOneBy({
      id,
      senderUserId,
    });
    if (!plaint) {
      throw new AppException(PlaintError.NOT_SENDER);
    }
    return plaint;
  }

  private async checkPlaintReceiver(
    id: number,
    receiverUserId: number,
  ): Promise<Plaint> {
    const plaint = await this.plaintsRepository.findOneBy({
      id,
      receiverUserId,
    });
    if (!plaint) {
      throw new AppException(PlaintError.NOT_RECEIVER);
    }
    return plaint;
  }

  private async create(dto: ExtCreatePlaintDto): Promise<void> {
    try {
      const plaint = this.plaintsRepository.create({
        title: dto.title,
        senderUserId: dto.myId,
        receiverUserId: dto.userId,
        senderText: dto.text,
      });
      await this.plaintsRepository.save(plaint);
    } catch (error) {
      throw new AppException(PlaintError.CREATE_FAILED);
    }
  }

  private async execute(
    plaint: Plaint,
    dto: ExtUpdatePlaintDto,
  ): Promise<void> {
    try {
      plaint.receiverText = dto.text;
      plaint.executedAt = new Date();
      await this.plaintsRepository.save(plaint);
    } catch (error) {
      throw new AppException(PlaintError.EXECUTE_FAILED);
    }
  }

  private async complete(
    plaint: Plaint,
    dto: ExtUpdatePlaintDto,
  ): Promise<void> {
    try {
      plaint.executorUserId = dto.myId;
      plaint.executorText = dto.text;
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
        'plaint.senderText',
        'receiverUser.id',
        'receiverUser.nick',
        'plaint.receiverText',
        'executorUser.id',
        'executorUser.nick',
        'plaint.executorText',
        'plaint.createdAt',
        'plaint.executedAt',
        'plaint.completedAt',
      ]);
  }
}
