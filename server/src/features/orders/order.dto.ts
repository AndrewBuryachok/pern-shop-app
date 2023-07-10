import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsOrderExists, IsStorageExists } from '../../common/constraints';
import {
  CreateTransportationDto,
  RateTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';

export class OrderIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsOrderExists)
  @Type(() => Number)
  orderId: number;
}

export class ExtOrderIdDto extends OrderIdDto {
  myId: number;
}

export class CreateOrderDto extends CreateTransportationDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStorageExists)
  storageId: number;
}

export class ExtCreateOrderDto extends CreateOrderDto {
  myId: number;
}

export class TakeOrderDto extends TakeTransportationDto {}

export class ExtTakeOrderDto extends TakeOrderDto {
  orderId: number;
  myId: number;
}

export class RateOrderDto extends RateTransportationDto {}

export class ExtRateOrderDto extends RateOrderDto {
  orderId: number;
  myId: number;
}
