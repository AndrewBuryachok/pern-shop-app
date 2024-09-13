import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { ReportView } from './report-view.entity';
import { Attitude } from './attitude.entity';
import { Annotation } from './annotation.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { ReportsController } from './reports.controller';
import { AnnotationsController } from './annotations.controller';
import { ReportsService } from './reports.service';
import { AnnotationsService } from './annotations.service';
import { IsAnnotationExists, IsReportExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, ReportView, Attitude, Annotation]),
    MqttModule,
  ],
  controllers: [ReportsController, AnnotationsController],
  providers: [
    ReportsService,
    AnnotationsService,
    IsReportExists,
    IsAnnotationExists,
  ],
})
export class ReportsModule {}
