import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsBoxExists, IsStationExists } from '../../common/constraints';
import { ExtCreateHireDto } from '../hires/hire.dto';

export class BoxIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsBoxExists)
  @Type(() => Number)
  boxId: number;
}

export class CreateBoxDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStationExists)
  stationId: number;
}

export class ExtCreateBoxDto extends CreateBoxDto {
  myId: number;
  hasRole: boolean;
  name?: number;
}

export class ReserveBoxDto extends ExtCreateHireDto {}
