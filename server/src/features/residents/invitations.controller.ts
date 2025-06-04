import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResidentsService } from './residents.service';
import { User } from '../users/user.entity';
import { Town } from '../towns/town.entity';
import { UserIdDto } from '../users/user.dto';
import { TownIdDto } from '../towns/town.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId } from '../../common/decorators';

@ApiTags('invitations')
@Controller('invitations')
export class InvitationsController {
  constructor(private residentsService: ResidentsService) {}

  @Get('sent')
  getSentInvitations(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.residentsService.getSentInvitations(myId, req);
  }

  @Get('received')
  getReceivedInvitations(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Town>> {
    return this.residentsService.getReceivedInvitations(myId, req);
  }

  @Post('sent/:userId')
  createResidentInvitation(
    @MyId() myId: number,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.residentsService.createResidentInvitation({ userId, myId });
  }

  @Delete('sent/:userId')
  cancelResidentInvitation(
    @MyId() myId: number,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.residentsService.cancelResidentInvitation({ userId, myId });
  }

  @Post('received/:townId')
  acceptResidentInvitation(
    @MyId() myId: number,
    @Param() { townId }: TownIdDto,
  ): Promise<void> {
    return this.residentsService.acceptResidentInvitation({ townId, myId });
  }

  @Delete('received/:townId')
  rejectResidentInvitation(
    @MyId() myId: number,
    @Param() { townId }: TownIdDto,
  ): Promise<void> {
    return this.residentsService.rejectResidentInvitation({ townId, myId });
  }
}
