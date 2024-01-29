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
import { Attitude } from './attitude.entity';
import { Annotation } from '../annotations/annotation.entity';
import {
  AttitudeReportDto,
  CreateReportDto,
  EditReportDto,
  ReportIdDto,
} from './report.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Public, Roles } from '../../common/decorators';
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
  @Get('status')
  getStatusReports(@Query() req: Request): Promise<Response<Report>> {
    return this.reportsService.getMarkReports(Mark.STATUS, req);
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

  @Get('attituded/select')
  selectAttitudedReports(@MyId() myId: number): Promise<Report[]> {
    return this.reportsService.selectAttitudedReports(myId);
  }

  @Public()
  @Get(':reportId/attitudes')
  selectReportAttitudes(
    @Param() { reportId }: ReportIdDto,
  ): Promise<Attitude[]> {
    return this.reportsService.selectReportAttitudes(reportId);
  }

  @Public()
  @Get(':reportId/annotations')
  selectReportAnnotations(
    @Param() { reportId }: ReportIdDto,
  ): Promise<Annotation[]> {
    return this.reportsService.selectReportAnnotations(reportId);
  }

  @Roles(Role.ADMIN)
  @Post('server')
  createServerReport(
    @MyId() myId: number,
    @Body() dto: CreateReportDto,
  ): Promise<void> {
    return this.reportsService.createReport({
      ...dto,
      myId,
      mark: Mark.SERVER,
    });
  }

  @Roles(Role.ADMIN)
  @Post('site')
  createSiteReport(
    @MyId() myId: number,
    @Body() dto: CreateReportDto,
  ): Promise<void> {
    return this.reportsService.createReport({
      ...dto,
      myId,
      mark: Mark.SITE,
    });
  }

  @Roles(Role.ADMIN)
  @Post('status')
  createStatusReport(
    @MyId() myId: number,
    @Body() dto: CreateReportDto,
  ): Promise<void> {
    return this.reportsService.createReport({
      ...dto,
      myId,
      mark: Mark.STATUS,
    });
  }

  @Roles(Role.SPAWN)
  @Post('spawn')
  createSpawnReport(
    @MyId() myId: number,
    @Body() dto: CreateReportDto,
  ): Promise<void> {
    return this.reportsService.createReport({
      ...dto,
      myId,
      mark: Mark.SPAWN,
    });
  }

  @Roles(Role.HUB)
  @Post('hub')
  createHubReport(
    @MyId() myId: number,
    @Body() dto: CreateReportDto,
  ): Promise<void> {
    return this.reportsService.createReport({
      ...dto,
      myId,
      mark: Mark.HUB,
    });
  }

  @Patch(':reportId')
  editReport(
    @MyId() myId: number,
    @Param() { reportId }: ReportIdDto,
    @Body() dto: EditReportDto,
  ): Promise<void> {
    return this.reportsService.editReport({ ...dto, reportId, myId });
  }

  @Delete(':reportId')
  deleteReport(
    @MyId() myId: number,
    @Param() { reportId }: ReportIdDto,
  ): Promise<void> {
    return this.reportsService.deleteReport({ reportId, myId });
  }

  @Post(':reportId/attitudes')
  attitudeReport(
    @MyId() myId: number,
    @Param() { reportId }: ReportIdDto,
    @Body() dto: AttitudeReportDto,
  ): Promise<void> {
    return this.reportsService.attitudeReport({ ...dto, reportId, myId });
  }
}
