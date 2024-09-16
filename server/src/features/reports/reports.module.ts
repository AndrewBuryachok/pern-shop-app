import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { ReportView } from './report-view.entity';
import { ReportLike } from './report-like.entity';
import { ReportComment } from './comment.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { ReportsController } from './reports.controller';
import { CommentsController } from './comments.controller';
import { ReportsService } from './reports.service';
import { CommentsService } from './comments.service';
import {
  IsReportCommentExists,
  IsReportExists,
} from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, ReportView, ReportLike, ReportComment]),
    MqttModule,
  ],
  controllers: [ReportsController, CommentsController],
  providers: [
    ReportsService,
    CommentsService,
    IsReportExists,
    IsReportCommentExists,
  ],
})
export class ReportsModule {}
