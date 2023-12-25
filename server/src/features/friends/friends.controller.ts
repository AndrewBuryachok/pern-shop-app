import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { User } from '../users/user.entity';
import { UserIdDto } from '../users/user.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId } from '../../common/decorators';

@ApiTags('friends')
@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Get('my')
  getMyFriends(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.friendsService.getMyFriends(myId, req);
  }

  @Get('received')
  getReceivedFriends(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.friendsService.getReceivedFriends(myId, req);
  }

  @Post(':userId')
  addFriend(@MyId() myId, @Param() { userId }: UserIdDto): Promise<void> {
    return this.friendsService.addFriend({ userId, myId });
  }

  @Delete(':userId')
  removeFriend(@MyId() myId, @Param() { userId }: UserIdDto): Promise<void> {
    return this.friendsService.removeFriend({ userId, myId });
  }
}
