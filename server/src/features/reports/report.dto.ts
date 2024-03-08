import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsLink, IsText } from '../../common/decorators';
import { IsReportExists } from '../../common/constraints';
import { CreateReactionDto } from '../reactions/reaction.dto';

export class ReportIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsReportExists)
  @Type(() => Number)
  reportId: number;
}

export class CreateReportDto {
  @ApiProperty()
  @IsText()
  text: string;

  @ApiProperty()
  @IsLink()
  image1: string;

  @ApiProperty()
  @IsLink()
  image2: string;

  @ApiProperty()
  @IsLink()
  image3: string;

  @ApiProperty()
  @IsLink()
  video: string;
}

export class ExtCreateReportDto extends CreateReportDto {
  myId: number;
  mark: number;
}

export class EditReportDto extends CreateReportDto {}

export class ExtEditReportDto extends CreateReportDto {
  reportId: number;
  myId: number;
}

export class DeleteReportDto extends ReportIdDto {
  myId: number;
}

export class ViewReportDto {
  reportId: number;
  myId: number;
}

export class AttitudeReportDto extends CreateReactionDto {}

export class ExtAttitudeReportDto extends AttitudeReportDto {
  reportId: number;
  myId: number;
}
