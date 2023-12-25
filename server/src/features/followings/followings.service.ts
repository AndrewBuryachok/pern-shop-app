import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { UpdateFollowingDto } from './following.dto';
import { Request, Response } from '../../common/interfaces';

@Injectable()
export class FollowingsService {
  constructor(private usersService: UsersService) {}

  getMyFollowings(myId: number, req: Request): Promise<Response<User>> {
    return this.usersService.getMyFollowings(myId, req);
  }

  getReceivedFollowings(myId: number, req: Request): Promise<Response<User>> {
    return this.usersService.getReceivedFollowings(myId, req);
  }

  async addFollowing(dto: UpdateFollowingDto): Promise<void> {
    await this.usersService.addUserFollowing({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
  }

  async removeFollowing(dto: UpdateFollowingDto): Promise<void> {
    await this.usersService.removeUserFollowing({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
  }
}
