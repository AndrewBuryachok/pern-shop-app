import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { MqttService } from './mqtt.service';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
