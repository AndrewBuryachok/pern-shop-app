import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { UsersController } from './users.controller';
import { FriendsController } from './friends.controller';
import { FollowingsController } from './followings.controller';
import { UsersService } from './users.service';
import { IsUserExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MqttModule],
  controllers: [UsersController, FriendsController, FollowingsController],
  providers: [UsersService, IsUserExists],
  exports: [UsersService],
})
export class UsersModule {}
