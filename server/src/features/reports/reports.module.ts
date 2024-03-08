import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { ReportView } from './report-view.entity';
import { Attitude } from './attitude.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { IsReportExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, ReportView, Attitude]),
    MqttModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, IsReportExists],
  exports: [ReportsService],
})
export class ReportsModule {}
