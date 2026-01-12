import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsDeliveryExists, IsPurchaseExists } from '../../common/constraints';
import {
  CompleteTransportationDto,
  CreateTransportationDto,
  EditTransportationDto,
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
  @Validate(IsPurchaseExists)
  purchaseId: number;
}

export class ExtCreateDeliveryDto extends CreateDeliveryDto {
  myId: number;
  hasRole: boolean;
}

export class EditDeliveryDto extends EditTransportationDto {}

export class ExtEditDeliveryDto extends EditDeliveryDto {
  deliveryId: number;
  myId: number;
  hasRole: boolean;
}

export class TakeDeliveryDto extends TakeTransportationDto {}

export class ExtTakeDeliveryDto extends TakeDeliveryDto {
  deliveryId: number;
  myId: number;
  hasRole: boolean;
}

export class CompleteDeliveryDto extends CompleteTransportationDto {}

export class ExtCompleteDeliveryDto extends CompleteDeliveryDto {
  deliveryId: number;
  myId: number;
  hasRole: boolean;
}
