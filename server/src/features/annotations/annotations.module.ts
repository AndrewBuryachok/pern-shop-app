import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Annotation } from './annotation.entity';
import { ReportsModule } from '../reports/reports.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { AnnotationsController } from './annotations.controller';
import { AnnotationsService } from './annotations.service';
import { IsAnnotationExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Annotation]), ReportsModule, MqttModule],
  controllers: [AnnotationsController],
  providers: [AnnotationsService, IsAnnotationExists],
})
export class AnnotationsModule {}
