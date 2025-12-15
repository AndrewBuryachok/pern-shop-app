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

@ApiTags(':project/invitations')
@Controller(':project/invitations')
export class InvitationsController {
  constructor(private residentsService: ResidentsService) {}

  @Get('sent')
  getSentInvitations(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.residentsService.getSentInvitations(project, myId, req);
  }

  @Get('received')
  getReceivedInvitations(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Town>> {
    return this.residentsService.getReceivedInvitations(project, myId, req);
  }

  @Post('sent/:userId')
  createResidentInvitation(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.residentsService.createResidentInvitation(project, {
      userId,
      myId,
    });
  }

  @Delete('sent/:userId')
  cancelResidentInvitation(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.residentsService.cancelResidentInvitation(project, {
      userId,
      myId,
    });
  }

  @Post('received/:townId')
  acceptResidentInvitation(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Param() { townId }: TownIdDto,
  ): Promise<void> {
    return this.residentsService.acceptResidentInvitation(project, {
      townId,
      myId,
    });
  }

  @Delete('received/:townId')
  rejectResidentInvitation(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Param() { townId }: TownIdDto,
  ): Promise<void> {
    return this.residentsService.rejectResidentInvitation(project, {
      townId,
      myId,
    });
  }
}
