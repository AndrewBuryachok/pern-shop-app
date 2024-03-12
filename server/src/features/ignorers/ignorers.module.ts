import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { IgnorersController } from './ignorers.controller';
import { IgnorersService } from './ignorers.service';

@Module({
  imports: [UsersModule, MqttModule],
  controllers: [IgnorersController],
  providers: [IgnorersService],
})
export class IgnorersModule {}
