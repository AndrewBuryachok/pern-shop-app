import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Report } from './report.entity';
import { ReportView } from './report-view.entity';
import { ReportLike } from './report-like.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeleteReportDto,
  ExtCreateReportDto,
  ExtEditReportDto,
  ExtLikeReportDto,
  ViewReportDto,
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
    @InjectRepository(ReportView)
    private viewsRepository: Repository<ReportView>,
    @InjectRepository(ReportLike)
    private likesRepository: Repository<ReportLike>,
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

  async selectViewedReports(myId: number): Promise<number[]> {
    const reports = await this.reportsRepository
      .createQueryBuilder('report')
      .innerJoinAndMapOne(
        'myView',
        'report.views',
        'myView',
        'myView.userId = :myId',
        { myId },
      )
      .select(['report.id'])
      .getMany();
    return reports.map((report) => report.id);
  }

  selectLikedReports(myId: number): Promise<Report[]> {
    return this.reportsRepository
      .createQueryBuilder('report')
      .innerJoinAndMapOne(
        'report.like',
        'report.likes',
        'myLike',
        'myLike.userId = :myId',
        { myId },
      )
      .select(['report.id', 'myLike.id', 'myLike.type'])
      .getMany();
  }

  selectReportViews(reportId: number): Promise<ReportView[]> {
    return this.selectReportsViewsQueryBuilder()
      .where('view.reportId = :reportId', { reportId })
      .getMany();
  }

  selectReportLikes(reportId: number): Promise<ReportLike[]> {
    return this.selectLikesQueryBuilder()
      .where('like.reportId = :reportId', { reportId })
      .getMany();
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
    const report = await this.checkReportOwner(
      dto.reportId,
      dto.myId,
      dto.hasRole,
    );
    await this.edit(report, dto);
    await this.mqttService.publishNotificationMention(
      dto.reportId,
      dto.text,
      dto.nick,
      Notification.MENTIONED_REPORT,
    );
  }

  async deleteReport(dto: DeleteReportDto): Promise<void> {
    const report = await this.checkReportOwner(
      dto.reportId,
      dto.myId,
      dto.hasRole,
    );
    await this.delete(report);
  }

  async viewReport(dto: ViewReportDto): Promise<void> {
    const view = await this.viewsRepository.findOneBy({
      reportId: dto.reportId,
      userId: dto.myId,
    });
    if (view) {
      throw new AppException(ReportError.ALREADY_VIEWED);
    }
    await this.addView(dto);
  }

  async likeReport(dto: ExtLikeReportDto & { nick: string }): Promise<void> {
    const like = await this.likesRepository.findOneBy({
      reportId: dto.reportId,
      userId: dto.myId,
    });
    const notify = !like || like.type !== dto.type;
    if (!like) {
      await this.addLike(dto);
    } else if (like.type !== dto.type) {
      await this.updateLike(like, dto);
    } else {
      await this.removeLike(like);
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

  async checkReportOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Report> {
    const report = await this.reportsRepository.findOneBy({ id });
    if (report.userId !== userId && !hasRole) {
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

  private async addView(dto: ViewReportDto): Promise<void> {
    try {
      const view = this.viewsRepository.create({
        reportId: dto.reportId,
        userId: dto.myId,
      });
      await this.viewsRepository.save(view);
    } catch (error) {
      throw new AppException(ReportError.ADD_VIEW_FAILED);
    }
  }

  private async addLike(dto: ExtLikeReportDto): Promise<void> {
    try {
      const like = this.likesRepository.create({
        reportId: dto.reportId,
        userId: dto.myId,
        type: dto.type,
      });
      await this.likesRepository.save(like);
    } catch (error) {
      throw new AppException(ReportError.ADD_LIKE_FAILED);
    }
  }

  private async updateLike(
    like: ReportLike,
    dto: ExtLikeReportDto,
  ): Promise<void> {
    try {
      like.type = dto.type;
      await this.likesRepository.save(like);
    } catch (error) {
      throw new AppException(ReportError.UPDATE_LIKE_FAILED);
    }
  }

  private async removeLike(like: ReportLike): Promise<void> {
    try {
      await this.likesRepository.remove(like);
    } catch (error) {
      throw new AppException(ReportError.REMOVE_LIKE_FAILED);
    }
  }

  private selectReportsViewsQueryBuilder(): SelectQueryBuilder<ReportView> {
    return this.viewsRepository
      .createQueryBuilder('view')
      .innerJoin('view.user', 'viewer')
      .orderBy('view.id', 'DESC')
      .select([
        'view.id',
        'viewer.id',
        'viewer.nick',
        'viewer.avatar',
        'view.createdAt',
      ]);
  }

  private selectLikesQueryBuilder(): SelectQueryBuilder<ReportLike> {
    return this.likesRepository
      .createQueryBuilder('like')
      .innerJoin('like.user', 'liker')
      .orderBy('like.id', 'DESC')
      .select([
        'like.id',
        'liker.id',
        'liker.nick',
        'liker.avatar',
        'like.type',
        'like.createdAt',
      ]);
  }

  private getReportsQueryBuilder(req: Request): SelectQueryBuilder<Report> {
    return this.reportsRepository
      .createQueryBuilder('report')
      .innerJoin('report.user', 'ownerUser')
      .loadRelationCountAndMap('report.views', 'report.views')
      .loadRelationCountAndMap(
        'report.upLikes',
        'report.likes',
        'upLike',
        (qb) => qb.where('upLike.type'),
      )
      .loadRelationCountAndMap(
        'report.downLikes',
        'report.likes',
        'downLike',
        (qb) => qb.where('NOT downLike.type'),
      )
      .loadRelationCountAndMap('report.comments', 'report.comments')
      .leftJoinAndMapOne(
        'report.comment',
        'report.comments',
        'comment',
        'comment.id = (SELECT MAX(a.id) FROM reports_comments AS a WHERE a.report_id = report.id)',
      )
      .leftJoin('comment.user', 'commenter')
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
        'comment.id',
        'commenter.id',
        'commenter.nick',
        'commenter.avatar',
        'comment.text',
        'comment.createdAt',
        'report.createdAt',
      ]);
  }
}
