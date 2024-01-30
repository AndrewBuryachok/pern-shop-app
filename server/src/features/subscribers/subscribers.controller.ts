import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscribersService } from './subscribers.service';
import { User } from '../users/user.entity';
import { UserIdDto } from '../users/user.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, MyNick } from '../../common/decorators';

@ApiTags('subscribers')
@Controller('subscribers')
export class SubscribersController {
  constructor(private subscribersService: SubscribersService) {}

  @Get('my')
  getMySubscribers(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.subscribersService.getMySubscribers(myId, req);
  }

  @Get('received')
  getReceivedSubscribers(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.subscribersService.getReceivedSubscribers(myId, req);
  }

  @Get('my/select')
  selectMySubscribers(@MyId() myId: number): Promise<User[]> {
    return this.subscribersService.selectMySubscribers(myId);
  }

  @Post(':userId')
  addSubscriber(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.subscribersService.addSubscriber({ userId, myId, nick });
  }

  @Delete(':userId')
  removeSubscriber(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.subscribersService.removeSubscriber({ userId, myId, nick });
  }
}
