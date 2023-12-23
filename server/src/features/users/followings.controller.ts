import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserIdDto } from './user.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId } from '../../common/decorators';

@ApiTags('followings')
@Controller('followings')
export class FollowingsController {
  constructor(private usersService: UsersService) {}

  @Get('my')
  getMyFollowings(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.usersService.getMyFollowings(myId, req);
  }

  @Get('received')
  getReceivedFollowings(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.usersService.getReceivedFollowings(myId, req);
  }

  @Post(':userId')
  addUserFollowing(
    @MyId() myId,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.usersService.addUserFollowing({ userId, myId });
  }

  @Delete(':userId')
  removeUserFollowing(
    @MyId() myId,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.usersService.removeUserFollowing({ userId, myId });
  }
}
