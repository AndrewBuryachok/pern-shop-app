import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserIdDto } from './user.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId } from '../../common/decorators';

@ApiTags('friends')
@Controller('friends')
export class FriendsController {
  constructor(private usersService: UsersService) {}

  @Get('my')
  getMyFriends(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.usersService.getMyFriends(myId, req);
  }

  @Get('received')
  getReceivedFriends(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.usersService.getReceivedFriends(myId, req);
  }

  @Post(':userId')
  addUserFriend(@MyId() myId, @Param() { userId }: UserIdDto): Promise<void> {
    return this.usersService.addUserFriend({ userId, myId });
  }

  @Delete(':userId')
  removeUserFriend(
    @MyId() myId,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.usersService.removeUserFriend({ userId, myId });
  }
}
