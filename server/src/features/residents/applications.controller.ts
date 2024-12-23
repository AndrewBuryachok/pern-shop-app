import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResidentsService } from './residents.service';
import { User } from '../users/user.entity';
import { Town } from '../towns/town.entity';
import { UserIdDto } from '../users/user.dto';
import { TownIdDto } from '../towns/town.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, MyNick } from '../../common/decorators';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private residentsService: ResidentsService) {}

  @Get('sent')
  getSentApplications(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Town>> {
    return this.residentsService.getSentApplications(myId, req);
  }

  @Get('received')
  getReceivedApplications(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.residentsService.getReceivedApplications(myId, req);
  }

  @Post('sent/:townId')
  createResidentApplication(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Param() { townId }: TownIdDto,
  ): Promise<void> {
    return this.residentsService.createResidentApplication({
      townId,
      myId,
      nick,
    });
  }

  @Delete('sent/:townId')
  cancelResidentApplication(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Param() { townId }: TownIdDto,
  ): Promise<void> {
    return this.residentsService.cancelResidentApplication({
      townId,
      myId,
      nick,
    });
  }

  @Post('received/:userId')
  acceptResidentApplication(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.residentsService.acceptResidentApplication({
      userId,
      myId,
      nick,
    });
  }

  @Delete('received/:userId')
  rejectResidentApplication(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.residentsService.rejectResidentApplication({
      userId,
      myId,
      nick,
    });
  }
}
