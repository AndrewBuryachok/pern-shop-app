import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { User } from '../users/user.entity';
import { UserIdDto } from '../users/user.dto';
import { ProjectDto } from '../../project.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId } from '../../common/decorators';

@ApiTags(':project/friends')
@Controller(':project/friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Get('my')
  getMyFriends(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.friendsService.getMyFriends(project, myId, req);
  }

  @Get('sent')
  getSentFriends(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.friendsService.getSentFriends(project, myId, req);
  }

  @Get('received')
  getReceivedFriends(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<User>> {
    return this.friendsService.getReceivedFriends(project, myId, req);
  }

  @Post(':userId')
  addFriend(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.friendsService.addFriend(project, { userId, myId });
  }

  @Delete(':userId')
  removeFriend(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Param() { userId }: UserIdDto,
  ): Promise<void> {
    return this.friendsService.removeFriend(project, { userId, myId });
  }
}
