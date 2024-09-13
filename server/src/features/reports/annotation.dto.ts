import { ApiProperty } from '@nestjs/swagger';
import { Validate, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsReportExists, IsAnnotationExists } from '../../common/constraints';
import { CreateReplyDto } from '../replies/reply.dto';

export class AnnotationIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsAnnotationExists)
  @Type(() => Number)
  annotationId: number;
}

export class EditAnnotationDto extends CreateReplyDto {}

export class ExtEditAnnotationDto extends EditAnnotationDto {
  annotationId: number;
  myId: number;
  hasRole: boolean;
}

export class CreateAnnotationDto extends EditAnnotationDto {
  @ApiProperty()
  @IsId()
  @Validate(IsReportExists)
  reportId: number;

  @ApiProperty()
  @ValidateIf((_, value) => value !== 0)
  @IsId()
  @Validate(IsAnnotationExists)
  annotationId: number;
}

export class ExtCreateAnnotationDto extends CreateAnnotationDto {
  myId: number;
}

export class DeleteAnnotationDto extends AnnotationIdDto {
  myId: number;
  hasRole: boolean;
}
