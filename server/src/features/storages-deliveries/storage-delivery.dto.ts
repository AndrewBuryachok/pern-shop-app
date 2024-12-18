import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import {
  IsSaleExists,
  IsStorageDeliveryExists,
} from '../../common/constraints';
import {
  CreateDeliveryDto,
  EditDeliveryDto,
  RateDeliveryDto,
  TakeDeliveryDto,
} from '../deliveries/delivery.dto';

export class StorageDeliveryIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStorageDeliveryExists)
  @Type(() => Number)
  storageDeliveryId: number;
}

export class ExtStorageDeliveryIdDto extends StorageDeliveryIdDto {
  myId: number;
  hasRole: boolean;
}

export class CreateStorageDeliveryDto extends CreateDeliveryDto {
  @ApiProperty()
  @IsId()
  @Validate(IsSaleExists)
  saleId: number;
}

export class ExtCreateStorageDeliveryDto extends CreateStorageDeliveryDto {
  myId: number;
  hasRole: boolean;
}

export class EditStorageDeliveryDto extends EditDeliveryDto {}

export class ExtEditStorageDeliveryDto extends EditStorageDeliveryDto {
  storageDeliveryId: number;
  myId: number;
  hasRole: boolean;
}

export class TakeStorageDeliveryDto extends TakeDeliveryDto {}

export class ExtTakeStorageDeliveryDto extends TakeStorageDeliveryDto {
  storageDeliveryId: number;
  myId: number;
  hasRole: boolean;
}

export class RateStorageDeliveryDto extends RateDeliveryDto {}

export class ExtRateStorageDeliveryDto extends RateStorageDeliveryDto {
  storageDeliveryId: number;
  myId: number;
  hasRole: boolean;
}
