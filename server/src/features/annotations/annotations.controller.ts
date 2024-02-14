import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnnotationsService } from './annotations.service';
import {
  AnnotationIdDto,
  CreateAnnotationDto,
  EditAnnotationDto,
} from './annotation.dto';
import { HasRole, MyId, MyNick } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('annotations')
@Controller('annotations')
export class AnnotationsController {
  constructor(private annotationsService: AnnotationsService) {}

  @Post()
  createAnnotation(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Body() dto: CreateAnnotationDto,
  ): Promise<void> {
    return this.annotationsService.createAnnotation({ ...dto, myId, nick });
  }

  @Patch(':annotationId')
  editAnnotation(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.JUDGE) hasRole: boolean,
    @Param() { annotationId }: AnnotationIdDto,
    @Body() dto: EditAnnotationDto,
  ): Promise<void> {
    return this.annotationsService.editAnnotation({
      ...dto,
      annotationId,
      myId,
      nick,
      hasRole,
    });
  }

  @Delete(':annotationId')
  deleteAnnotation(
    @MyId() myId: number,
    @HasRole(Role.JUDGE) hasRole: boolean,
    @Param() { annotationId }: AnnotationIdDto,
  ): Promise<void> {
    return this.annotationsService.deleteAnnotation({
      annotationId,
      myId,
      hasRole,
    });
  }
}
