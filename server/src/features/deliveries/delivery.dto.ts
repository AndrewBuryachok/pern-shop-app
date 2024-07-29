import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsDeliveryExists, IsStationExists } from '../../common/constraints';
import {
  CreateTransportationDto,
  RateTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';
import { CreateThingDto } from '../things/thing.dto';

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
  @Validate(IsStationExists)
  fromStationId: number;

  @ApiProperty()
  @IsId()
  @Validate(IsStationExists)
  toStationId: number;
}

export class EditDeliveryDto extends CreateThingDto {}

export class ExtEditDeliveryDto extends EditDeliveryDto {
  deliveryId: number;
  myId: number;
  hasRole: boolean;
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
