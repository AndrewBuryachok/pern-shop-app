import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MqttService } from './mqtt.service';
import { Public } from '../../common/decorators';

@ApiTags('mqtt')
@Controller('mqtt')
export class MqttController {
  constructor(private mqttService: MqttService) {}

  @Public()
  @Get('users')
  getCurrentUsers(): Promise<number[]> {
    return this.mqttService.getCurrentUsers();
  }

  @Public()
  @Get('notifications')
  getCurrentNotifications(): Promise<string[]> {
    return this.mqttService.getCurrentNotifications();
  }
}
