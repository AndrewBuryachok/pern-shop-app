import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MqttService } from './mqtt.service';
import { ProjectDto } from '../../project.dto';
import { Public } from '../../common/decorators';

@ApiTags(':project/mqtt')
@Controller(':project/mqtt')
export class MqttController {
  constructor(private mqttService: MqttService) {}

  @Public()
  @Get('users')
  getCurrentUsers(@Param() { project }: ProjectDto): number[] {
    return this.mqttService.getCurrentUsers(project);
  }

  @Public()
  @Get('notifications')
  getCurrentNotifications(@Param() { project }: ProjectDto): string[] {
    return this.mqttService.getCurrentNotifications(project);
  }
}
