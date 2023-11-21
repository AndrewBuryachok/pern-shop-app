import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CitiesModule } from '../cities/cities.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { IsTaskExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), CitiesModule, MqttModule],
  controllers: [TasksController],
  providers: [TasksService, IsTaskExists],
})
export class TasksModule {}
