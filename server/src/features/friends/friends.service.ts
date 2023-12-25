import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { UpdateFriendDto } from './friend.dto';
import { Request, Response } from '../../common/interfaces';

@Injectable()
export class FriendsService {
  constructor(private usersService: UsersService) {}

  getMyFriends(myId: number, req: Request): Promise<Response<User>> {
    return this.usersService.getMyFriends(myId, req);
  }

  getReceivedFriends(myId: number, req: Request): Promise<Response<User>> {
    return this.usersService.getReceivedFriends(myId, req);
  }

  async addFriend(dto: UpdateFriendDto): Promise<void> {
    await this.usersService.addUserFriend({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
  }

  async removeFriend(dto: UpdateFriendDto): Promise<void> {
    await this.usersService.removeUserFriend({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
  }
}
