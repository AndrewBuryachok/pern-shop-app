import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { TwitchModule } from '../twitch/twitch.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { IsUserExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => MqttModule),
    forwardRef(() => TwitchModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, IsUserExists],
  exports: [UsersService],
})
export class UsersModule {}
