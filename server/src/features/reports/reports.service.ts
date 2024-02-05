import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Report } from './report.entity';
import { Attitude } from './attitude.entity';
import { Annotation } from '../annotations/annotation.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeleteReportDto,
  ExtAttitudeReportDto,
  ExtCreateReportDto,
  ExtEditReportDto,
} from './report.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { ReportError } from './report-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
    @InjectRepository(Attitude)
    private attitudesRepository: Repository<Attitude>,
    private mqttService: MqttService,
  ) {}

  async getMainReports(req: Request): Promise<Response<Report>> {
    const [result, count] = await this.getReportsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMarkReports(mark: number, req: Request): Promise<Response<Report>> {
    const [result, count] = await this.getReportsQueryBuilder(req)
      .andWhere('report.mark = :mark', { mark })
      .getManyAndCount();
    return { result, count };
  }

  selectAttitudedReports(myId: number): Promise<Report[]> {
    return this.reportsRepository
      .createQueryBuilder('report')
      .innerJoinAndMapOne(
        'report.attitude',
        'report.attitudes',
        'myAttitude',
        'myAttitude.userId = :myId',
        { myId },
      )
      .select(['report.id', 'myAttitude.id', 'myAttitude.type'])
      .getMany();
  }

  async selectReportAttitudes(reportId: number): Promise<Attitude[]> {
    const report = await this.reportsRepository
      .createQueryBuilder('report')
      .leftJoin('report.attitudes', 'attitude')
      .leftJoin('attitude.user', 'attituder')
      .where('report.id = :reportId', { reportId })
      .orderBy('attitude.id', 'ASC')
      .select([
        'report.id',
        'attitude.id',
        'attituder.id',
        'attituder.nick',
        'attituder.avatar',
        'attitude.type',
        'attitude.createdAt',
      ])
      .getOne();
    return report.attitudes;
  }

  async selectReportAnnotations(reportId: number): Promise<Annotation[]> {
    const report = await this.reportsRepository
      .createQueryBuilder('report')
      .leftJoin('report.annotations', 'annotation')
      .leftJoin('annotation.reply', 'reply')
      .leftJoin('reply.user', 'replier')
      .leftJoin('annotation.user', 'annotationer')
      .where('report.id = :reportId', { reportId })
      .orderBy('annotation.id', 'ASC')
      .select([
        'report.id',
        'annotation.id',
        'reply.id',
        'replier.id',
        'replier.nick',
        'replier.avatar',
        'reply.text',
        'annotationer.id',
        'annotationer.nick',
        'annotationer.avatar',
        'annotation.text',
        'annotation.createdAt',
      ])
      .getOne();
    return report.annotations;
  }

  async createReport(
    dto: ExtCreateReportDto & { nick: string },
  ): Promise<void> {
    const report = await this.create(dto);
    this.mqttService.publishNotificationMessage(
      report.id,
      0,
      dto.nick,
      Notification.CREATED_REPORT,
    );
    await this.mqttService.publishNotificationMention(
      report.id,
      dto.text,
      dto.nick,
      Notification.MENTIONED_REPORT,
    );
  }

  async editReport(dto: ExtEditReportDto & { nick: string }): Promise<void> {
    const report = await this.checkReportOwner(dto.reportId, dto.myId);
    await this.edit(report, dto);
    await this.mqttService.publishNotificationMention(
      dto.reportId,
      dto.text,
      dto.nick,
      Notification.MENTIONED_REPORT,
    );
  }

  async deleteReport(dto: DeleteReportDto): Promise<void> {
    const report = await this.checkReportOwner(dto.reportId, dto.myId);
    await this.delete(report);
  }

  async attitudeReport(
    dto: ExtAttitudeReportDto & { nick: string },
  ): Promise<void> {
    const attitude = await this.attitudesRepository.findOneBy({
      reportId: dto.reportId,
      userId: dto.myId,
    });
    const notify = !attitude || attitude.type !== dto.type;
    if (!attitude) {
      await this.addAttitude(dto);
    } else if (attitude.type !== dto.type) {
      await this.updateAttitude(attitude, dto);
    } else {
      await this.removeAttitude(attitude);
    }
    if (notify) {
      const report = await this.findReportById(dto.reportId);
      this.mqttService.publishNotificationMessage(
        dto.reportId,
        report.userId,
        dto.nick,
        Notification.REACTED_REPORT,
      );
    }
  }

  async checkReportExists(id: number): Promise<void> {
    await this.reportsRepository.findOneByOrFail({ id });
  }

  async checkReportOwner(id: number, userId: number): Promise<Report> {
    const report = await this.reportsRepository.findOneBy({ id });
    if (report.userId !== userId) {
      throw new AppException(ReportError.NOT_OWNER);
    }
    return report;
  }

  findReportById(id: number): Promise<Report> {
    return this.reportsRepository.findOneBy({ id });
  }

  private async create(dto: ExtCreateReportDto): Promise<Report> {
    try {
      const report = this.reportsRepository.create({
        userId: dto.myId,
        text: dto.text,
        image1: dto.image1,
        image2: dto.image2,
        image3: dto.image3,
        video: dto.video,
        mark: dto.mark,
      });
      await this.reportsRepository.save(report);
      return report;
    } catch (error) {
      throw new AppException(ReportError.CREATE_FAILED);
    }
  }

  private async edit(report: Report, dto: ExtEditReportDto): Promise<void> {
    try {
      report.text = dto.text;
      report.image1 = dto.image1;
      report.image2 = dto.image2;
      report.image3 = dto.image3;
      report.video = dto.video;
      await this.reportsRepository.save(report);
    } catch (error) {
      throw new AppException(ReportError.EDIT_FAILED);
    }
  }

  private async delete(report: Report): Promise<void> {
    try {
      await this.reportsRepository.remove(report);
    } catch (error) {
      throw new AppException(ReportError.DELETE_FAILED);
    }
  }

  private async addAttitude(dto: ExtAttitudeReportDto): Promise<void> {
    try {
      const attitude = this.attitudesRepository.create({
        reportId: dto.reportId,
        userId: dto.myId,
        type: dto.type,
      });
      await this.attitudesRepository.save(attitude);
    } catch (error) {
      throw new AppException(ReportError.ADD_ATTITUDE_FAILED);
    }
  }

  private async updateAttitude(
    attitude: Attitude,
    dto: ExtAttitudeReportDto,
  ): Promise<void> {
    try {
      attitude.type = dto.type;
      await this.attitudesRepository.save(attitude);
    } catch (error) {
      throw new AppException(ReportError.UPDATE_ATTITUDE_FAILED);
    }
  }

  private async removeAttitude(attitude: Attitude): Promise<void> {
    try {
      await this.attitudesRepository.remove(attitude);
    } catch (error) {
      throw new AppException(ReportError.REMOVE_ATTITUDE_FAILED);
    }
  }

  private getReportsQueryBuilder(req: Request): SelectQueryBuilder<Report> {
    return this.reportsRepository
      .createQueryBuilder('report')
      .innerJoin('report.user', 'ownerUser')
      .loadRelationCountAndMap(
        'report.upAttitudes',
        'report.attitudes',
        'upAttitude',
        (qb) => qb.where('upAttitude.type'),
      )
      .loadRelationCountAndMap(
        'report.downAttitudes',
        'report.attitudes',
        'downAttitude',
        (qb) => qb.where('NOT downAttitude.type'),
      )
      .loadRelationCountAndMap('report.annotations', 'report.annotations')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('report.id = :id', { id: req.id }),
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
            .where(`${!req.minDate}`)
            .orWhere('report.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('report.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .orderBy('report.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'report.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'report.text',
        'report.image1',
        'report.image2',
        'report.image3',
        'report.video',
        'report.createdAt',
      ]);
  }
}
