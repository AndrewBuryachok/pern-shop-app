import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MqttService } from './mqtt.service';
import { Public } from '../../common/decorators';

@ApiTags('mqtt')
@Controller('mqtt')
export class MqttController {
  constructor(private mqttService: MqttService) {}

  @Public()
  @Get('online')
  getOnlineUsers(): number[] {
    return this.mqttService.getOnlineUsers();
  }

  @Public()
  @Get('offline')
  getOfflineUsers(): number[] {
    return this.mqttService.getOfflineUsers();
  }

  @Public()
  @Get('notifications')
  getCurrentNotifications(): string[] {
    return this.mqttService.getCurrentNotifications();
  }
}
