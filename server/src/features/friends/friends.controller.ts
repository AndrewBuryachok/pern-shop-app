import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { Friend } from './friend.entity';
import { CreateFriendDto, FriendIdDto } from './friend.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('friends')
@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Public()
  @Get()
  getMainFriends(@Query() req: Request): Promise<Response<Friend>> {
    return this.friendsService.getMainFriends(req);
  }

  @Get('my')
  getMyFriends(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Friend>> {
    return this.friendsService.getMyFriends(myId, req);
  }

  @Roles(Role.ADMIN)
  @Get('all')
  getAllFriends(@Query() req: Request): Promise<Response<Friend>> {
    return this.friendsService.getAllFriends(req);
  }

  @Post()
  createFriend(@MyId() myId, @Body() dto: CreateFriendDto): Promise<void> {
    return this.friendsService.createFriend({ ...dto, myId });
  }

  @Post(':friendId')
  addFriend(@MyId() myId, @Param() { friendId }: FriendIdDto): Promise<void> {
    return this.friendsService.addFriend({ friendId, myId });
  }

  @Delete(':friendId')
  removeFriend(
    @MyId() myId,
    @Param() { friendId }: FriendIdDto,
  ): Promise<void> {
    return this.friendsService.removeFriend({ friendId, myId });
  }
}
