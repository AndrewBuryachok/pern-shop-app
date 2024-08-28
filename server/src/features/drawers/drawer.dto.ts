import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsDrawerExists, IsStationExists } from '../../common/constraints';
import { ExtCreateHireDto } from '../hires/hire.dto';

export class DrawerIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsDrawerExists)
  @Type(() => Number)
  drawerId: number;
}

export class CreateDrawerDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStationExists)
  stationId: number;
}

export class ExtCreateDrawerDto extends CreateDrawerDto {
  myId: number;
  hasRole: boolean;
  name?: number;
}

export class ReserveDrawerDto extends ExtCreateHireDto {}
