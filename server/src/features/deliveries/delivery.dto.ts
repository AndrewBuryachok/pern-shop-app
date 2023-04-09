import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import {
  IsDeliveryExists,
  IsStorageExists,
  IsUserExists,
} from '../../common/constraints';
import {
  CreateTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';

export class DeliveryIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsDeliveryExists)
  @Type(() => Number)
  deliveryId: number;
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

  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  userId: number;
}

export class ExtCreateDeliveryDto extends CreateDeliveryDto {
  myId: number;
}

export class TakeDeliveryDto extends TakeTransportationDto {}

export class ExtTakeDeliveryDto extends TakeDeliveryDto {
  deliveryId: number;
  myId: number;
}

export class ExtDeliveryIdDto extends DeliveryIdDto {
  myId: number;
}
