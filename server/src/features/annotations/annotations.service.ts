import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Annotation } from './annotation.entity';
import { ReportsService } from '../reports/reports.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeleteAnnotationDto,
  ExtCreateAnnotationDto,
  ExtEditAnnotationDto,
} from './annotation.dto';
import { AppException } from '../../common/exceptions';
import { AnnotationError } from './annotation-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class AnnotationsService {
  constructor(
    @InjectRepository(Annotation)
    private annotationsRepository: Repository<Annotation>,
    private reportsService: ReportsService,
    private mqttService: MqttService,
  ) {}

  async createAnnotation(
    dto: ExtCreateAnnotationDto & { nick: string },
  ): Promise<void> {
    await this.create(dto);
    const report = await this.reportsService.findReportById(dto.reportId);
    this.mqttService.publishNotificationMessage(
      dto.reportId,
      report.userId,
      dto.nick,
      Notification.ANNOTATED_REPORT,
    );
    if (dto.annotationId) {
      const reply = await this.annotationsRepository.findOneBy({
        id: dto.annotationId,
      });
      this.mqttService.publishNotificationMessage(
        dto.reportId,
        reply.userId,
        dto.nick,
        Notification.REPLIED_ANNOTATION,
      );
    }
    await this.mqttService.publishNotificationMention(
      dto.reportId,
      dto.text,
      dto.nick,
      Notification.MENTIONED_ANNOTATION,
    );
  }

  async editAnnotation(
    dto: ExtEditAnnotationDto & { nick: string },
  ): Promise<void> {
    const annotation = await this.checkAnnotationOwner(
      dto.annotationId,
      dto.myId,
      dto.hasRole,
    );
    await this.edit(annotation, dto);
    await this.mqttService.publishNotificationMention(
      annotation.reportId,
      dto.text,
      dto.nick,
      Notification.MENTIONED_ANNOTATION,
    );
  }

  async deleteAnnotation(dto: DeleteAnnotationDto): Promise<void> {
    const annotation = await this.checkAnnotationOwner(
      dto.annotationId,
      dto.myId,
      dto.hasRole,
    );
    await this.delete(annotation);
  }

  async checkAnnotationExists(id: number): Promise<void> {
    await this.annotationsRepository.findOneByOrFail({ id });
  }

  async checkAnnotationOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Annotation> {
    const annotation = await this.annotationsRepository.findOneBy({ id });
    if (annotation.userId !== userId && !hasRole) {
      throw new AppException(AnnotationError.NOT_OWNER);
    }
    return annotation;
  }

  private async create(dto: ExtCreateAnnotationDto): Promise<Annotation> {
    try {
      const annotation = this.annotationsRepository.create({
        reportId: dto.reportId,
        replyId: dto.annotationId || null,
        userId: dto.myId,
        text: dto.text,
      });
      await this.annotationsRepository.save(annotation);
      return annotation;
    } catch (error) {
      throw new AppException(AnnotationError.CREATE_FAILED);
    }
  }

  private async edit(
    annotation: Annotation,
    dto: ExtEditAnnotationDto,
  ): Promise<void> {
    try {
      annotation.text = dto.text;
      await this.annotationsRepository.save(annotation);
    } catch (error) {
      throw new AppException(AnnotationError.EDIT_FAILED);
    }
  }

  private async delete(annotation: Annotation): Promise<void> {
    try {
      await this.annotationsRepository.remove(annotation);
    } catch (error) {
      throw new AppException(AnnotationError.DELETE_FAILED);
    }
  }
}
