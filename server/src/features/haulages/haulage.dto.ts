import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsHaulageExists, IsStationExists } from '../../common/constraints';
import {
  CreateTransportationDto,
  RateTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';
import { CreateThingDto } from '../things/thing.dto';

export class HaulageIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsHaulageExists)
  @Type(() => Number)
  haulageId: number;
}

export class ExtHaulageIdDto extends HaulageIdDto {
  myId: number;
  hasRole: boolean;
}

export class CreateHaulageDto extends CreateTransportationDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStationExists)
  fromStationId: number;

  @ApiProperty()
  @IsId()
  @Validate(IsStationExists)
  toStationId: number;
}

export class ExtCreateHaulageDto extends CreateHaulageDto {
  myId: number;
  hasRole: boolean;
}

export class EditHaulageDto extends CreateThingDto {}

export class ExtEditHaulageDto extends EditHaulageDto {
  haulageId: number;
  myId: number;
  hasRole: boolean;
}

export class TakeHaulageDto extends TakeTransportationDto {}

export class ExtTakeHaulageDto extends TakeHaulageDto {
  haulageId: number;
  myId: number;
  hasRole: boolean;
}

export class RateHaulageDto extends RateTransportationDto {}

export class ExtRateHaulageDto extends RateHaulageDto {
  haulageId: number;
  myId: number;
  hasRole: boolean;
}
