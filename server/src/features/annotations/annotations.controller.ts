import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnnotationsService } from './annotations.service';
import {
  AnnotationIdDto,
  CreateAnnotationDto,
  EditAnnotationDto,
} from './annotation.dto';
import { HasRole, MyId } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('annotations')
@Controller('annotations')
export class AnnotationsController {
  constructor(private annotationsService: AnnotationsService) {}

  @Post()
  createAnnotation(
    @MyId() myId: number,
    @Body() dto: CreateAnnotationDto,
  ): Promise<void> {
    return this.annotationsService.createAnnotation({ ...dto, myId });
  }

  @Patch(':annotationId')
  editAnnotation(
    @MyId() myId: number,
    @HasRole(Role.ADMIN) hasRole: boolean,
    @Param() { annotationId }: AnnotationIdDto,
    @Body() dto: EditAnnotationDto,
  ): Promise<void> {
    return this.annotationsService.editAnnotation({
      ...dto,
      annotationId,
      myId,
      hasRole,
    });
  }

  @Delete(':annotationId')
  deleteAnnotation(
    @MyId() myId: number,
    @HasRole(Role.ADMIN) hasRole: boolean,
    @Param() { annotationId }: AnnotationIdDto,
  ): Promise<void> {
    return this.annotationsService.deleteAnnotation({
      annotationId,
      myId,
      hasRole,
    });
  }
}
