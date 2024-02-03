import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { MqttController } from './mqtt.controller';
import { MqttService } from './mqtt.service';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [MqttController],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
