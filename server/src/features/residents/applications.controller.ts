import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResidentsService } from './residents.service';
import { User } from '../users/user.entity';
import { Town } from '../towns/town.entity';
import { UserIdDto } from '../users/user.dto';
import { TownIdDto } from '../towns/town.dto';
import { ProjectDto } from '../../project.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId } from '../../common/decorators';

@ApiTags(':project/applications')
@Controller(':project/applications')
export class ApplicationsController {
  constructor(private residentsService: ResidentsService) {}

  @Get('sent')
  getSentApplications(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Town>> {
    return this.residentsService.getSentApplications(project, myId, req);
  }

  @Get('received')
  getReceivedApplications(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.residentsService.getReceivedApplications(project, myId, req);
  }

  @Post('sent/:townId')
  createResidentApplication(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Param() { townId }: TownIdDto,
  ): Promise<void> {
    return this.residentsService.createResidentApplication(project, {
      townId,
      myId,
    });
  }

  @Delete('sent/:townId')
  cancelResidentApplication(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Param() { townId }: TownIdDto,
  ): Promise<void> {
    return this.residentsService.cancelResidentApplication(project, {
      townId,
      myId,
    });
  }

  @Post('received/:userId')
  acceptResidentApplication(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.residentsService.acceptResidentApplication(project, {
      userId,
      myId,
    });
  }

  @Delete('received/:userId')
  rejectResidentApplication(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.residentsService.rejectResidentApplication(project, {
      userId,
      myId,
    });
  }
}
