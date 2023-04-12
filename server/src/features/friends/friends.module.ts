import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './friend.entity';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { IsFriendExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Friend])],
  controllers: [FriendsController],
  providers: [FriendsService, IsFriendExists],
})
export class FriendsModule {}
