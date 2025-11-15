import { forwardRef, Module } from '@nestjs/common';
import { MqttModule } from '../mqtt/mqtt.module';
import { UsersModule } from '../users/users.module';
import { TwitchController } from './twitch.controller';
import { TwitchService } from './twitch.service';

@Module({
  imports: [forwardRef(() => MqttModule), forwardRef(() => UsersModule)],
  controllers: [TwitchController],
  providers: [TwitchService],
  exports: [TwitchService],
})
export class TwitchModule {}
