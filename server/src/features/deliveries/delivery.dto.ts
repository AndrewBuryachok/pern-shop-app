import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsDeliveryExists, IsStorageExists } from '../../common/constraints';
import {
  CreateTransportationDto,
  RateTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';

export class DeliveryIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsDeliveryExists)
  @Type(() => Number)
  deliveryId: number;
}

export class ExtDeliveryIdDto extends DeliveryIdDto {
  myId: number;
  hasRole: boolean;
}

export class CreateDeliveryDto extends CreateTransportationDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStorageExists)
  fromStorageId: number;

  @ApiProperty()
  @IsId()
  @Validate(IsStorageExists)
  toStorageId: number;
}

export class ExtCreateDeliveryDto extends CreateDeliveryDto {
  myId: number;
  hasRole: boolean;
}

export class TakeDeliveryDto extends TakeTransportationDto {}

export class ExtTakeDeliveryDto extends TakeDeliveryDto {
  deliveryId: number;
  myId: number;
  hasRole: boolean;
}

export class RateDeliveryDto extends RateTransportationDto {}

export class ExtRateDeliveryDto extends RateDeliveryDto {
  deliveryId: number;
  myId: number;
  hasRole: boolean;
}
