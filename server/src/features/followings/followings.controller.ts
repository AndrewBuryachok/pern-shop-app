import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FollowingsService } from './followings.service';
import { User } from '../users/user.entity';
import { UserIdDto } from '../users/user.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId } from '../../common/decorators';

@ApiTags('followings')
@Controller('followings')
export class FollowingsController {
  constructor(private followingsService: FollowingsService) {}

  @Get('my')
  getMyFollowings(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.followingsService.getMyFollowings(myId, req);
  }

  @Get('received')
  getReceivedFollowings(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.followingsService.getReceivedFollowings(myId, req);
  }

  @Post(':userId')
  addFollowing(@MyId() myId, @Param() { userId }: UserIdDto): Promise<void> {
    return this.followingsService.addFollowing({ userId, myId });
  }

  @Delete(':userId')
  removeFollowing(@MyId() myId, @Param() { userId }: UserIdDto): Promise<void> {
    return this.followingsService.removeFollowing({ userId, myId });
  }
}
