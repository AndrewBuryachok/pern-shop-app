import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { Report } from './report.entity';
import { ReportView } from './report-view.entity';
import { ReportLike } from './report-like.entity';
import {
  CreateReportDto,
  EditReportDto,
  LikeReportDto,
  ReportIdDto,
} from './report.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';
import { Mark } from './mark.enum';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Public()
  @Get()
  getMainReports(@Query() req: Request): Promise<Response<Report>> {
    return this.reportsService.getMainReports(req);
  }

  @Public()
  @Get('server')
  getServerReports(@Query() req: Request): Promise<Response<Report>> {
    return this.reportsService.getMarkReports(Mark.SERVER, req);
  }

  @Public()
  @Get('site')
  getSiteReports(@Query() req: Request): Promise<Response<Report>> {
    return this.reportsService.getMarkReports(Mark.SITE, req);
  }

  @Public()
  @Get('events')
  getEventsReports(@Query() req: Request): Promise<Response<Report>> {
    return this.reportsService.getMarkReports(Mark.EVENTS, req);
  }

  @Public()
  @Get('spawn')
  getSpawnReports(@Query() req: Request): Promise<Response<Report>> {
    return this.reportsService.getMarkReports(Mark.SPAWN, req);
  }

  @Public()
  @Get('hub')
  getHubReports(@Query() req: Request): Promise<Response<Report>> {
    return this.reportsService.getMarkReports(Mark.HUB, req);
  }

  @Public()
  @Get('end')
  getEndReports(@Query() req: Request): Promise<Response<Report>> {
    return this.reportsService.getMarkReports(Mark.END, req);
  }

  @Get('viewed/select')
  selectViewedReports(@MyId() myId: number): Promise<number[]> {
    return this.reportsService.selectViewedReports(myId);
  }

  @Get('liked/select')
  selectLikedReports(
    @MyId() myId: number,
  ): Promise<{ up: number[]; down: number[] }> {
    return this.reportsService.selectLikedReports(myId);
  }

  @Public()
  @Get(':reportId/views')
  selectReportViews(@Param() { reportId }: ReportIdDto): Promise<ReportView[]> {
    return this.reportsService.selectReportViews(reportId);
  }

  @Public()
  @Get(':reportId/likes')
  selectReportLikes(@Param() { reportId }: ReportIdDto): Promise<ReportLike[]> {
    return this.reportsService.selectReportLikes(reportId);
  }

  @Roles(Role.INSPECTOR)
  @Post('server')
  createServerReport(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Body() dto: CreateReportDto,
  ): Promise<void> {
    return this.reportsService.createReport({
      ...dto,
      myId,
      nick,
      mark: Mark.SERVER,
    });
  }

  @Roles(Role.INSPECTOR)
  @Post('site')
  createSiteReport(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Body() dto: CreateReportDto,
  ): Promise<void> {
    return this.reportsService.createReport({
      ...dto,
      myId,
      nick,
      mark: Mark.SITE,
    });
  }

  @Post('events')
  createEventsReport(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Body() dto: CreateReportDto,
  ): Promise<void> {
    return this.reportsService.createReport({
      ...dto,
      myId,
      nick,
      mark: Mark.EVENTS,
    });
  }

  @Roles(Role.SPAWN)
  @Post('spawn')
  createSpawnReport(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Body() dto: CreateReportDto,
  ): Promise<void> {
    return this.reportsService.createReport({
      ...dto,
      myId,
      nick,
      mark: Mark.SPAWN,
    });
  }

  @Roles(Role.HUB)
  @Post('hub')
  createHubReport(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Body() dto: CreateReportDto,
  ): Promise<void> {
    return this.reportsService.createReport({
      ...dto,
      myId,
      nick,
      mark: Mark.HUB,
    });
  }

  @Roles(Role.END)
  @Post('end')
  createEndReport(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Body() dto: CreateReportDto,
  ): Promise<void> {
    return this.reportsService.createReport({
      ...dto,
      myId,
      nick,
      mark: Mark.END,
    });
  }

  @Patch(':reportId')
  editReport(
    @MyId() myId: number,
    @HasRole(Role.INSPECTOR) hasRole: boolean,
    @Param() { reportId }: ReportIdDto,
    @Body() dto: EditReportDto,
  ): Promise<void> {
    return this.reportsService.editReport({ ...dto, reportId, myId, hasRole });
  }

  @Delete(':reportId')
  deleteReport(
    @MyId() myId: number,
    @HasRole(Role.INSPECTOR) hasRole: boolean,
    @Param() { reportId }: ReportIdDto,
  ): Promise<void> {
    return this.reportsService.deleteReport({ reportId, myId, hasRole });
  }

  @Post(':reportId/views')
  viewReport(
    @MyId() myId: number,
    @Param() { reportId }: ReportIdDto,
  ): Promise<void> {
    return this.reportsService.viewReport({ reportId, myId });
  }

  @Post(':reportId/likes')
  likeReport(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Param() { reportId }: ReportIdDto,
    @Body() dto: LikeReportDto,
  ): Promise<void> {
    return this.reportsService.likeReport({ ...dto, reportId, myId, nick });
  }
}
