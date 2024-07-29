import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsOrderExists, IsStationExists } from '../../common/constraints';
import {
  CreateTransportationDto,
  RateTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';
import { CreateThingDto } from '../things/thing.dto';

export class OrderIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsOrderExists)
  @Type(() => Number)
  orderId: number;
}

export class ExtOrderIdDto extends OrderIdDto {
  myId: number;
  hasRole: boolean;
}

export class CreateOrderDto extends CreateTransportationDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStationExists)
  stationId: number;
}

export class ExtCreateOrderDto extends CreateOrderDto {
  myId: number;
  hasRole: boolean;
}

export class EditOrderDto extends CreateThingDto {}

export class ExtEditOrderDto extends EditOrderDto {
  orderId: number;
  myId: number;
  hasRole: boolean;
}

export class TakeOrderDto extends TakeTransportationDto {}

export class ExtTakeOrderDto extends TakeOrderDto {
  orderId: number;
  myId: number;
  hasRole: boolean;
}

export class RateOrderDto extends RateTransportationDto {}

export class ExtRateOrderDto extends RateOrderDto {
  orderId: number;
  myId: number;
  hasRole: boolean;
}
