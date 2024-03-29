import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitation } from './invitation.entity';
import { UsersModule } from '../users/users.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invitation]), UsersModule, MqttModule],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
