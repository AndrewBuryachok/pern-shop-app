import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import {
  IsSaleExists,
  IsStorageDeliveryExists,
} from '../../common/constraints';
import {
  CreateHaulageDto,
  RateHaulageDto,
  TakeHaulageDto,
} from '../haulages/haulage.dto';

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

export class CreateStorageDeliveryDto extends CreateHaulageDto {
  @ApiProperty()
  @IsId()
  @Validate(IsSaleExists)
  saleId: number;
}

export class ExtCreateStorageDeliveryDto extends CreateStorageDeliveryDto {
  myId: number;
  hasRole: boolean;
}

export class TakeStorageDeliveryDto extends TakeHaulageDto {}

export class ExtTakeStorageDeliveryDto extends TakeStorageDeliveryDto {
  storageDeliveryId: number;
  myId: number;
  hasRole: boolean;
}

export class RateStorageDeliveryDto extends RateHaulageDto {}

export class ExtRateStorageDeliveryDto extends RateStorageDeliveryDto {
  storageDeliveryId: number;
  myId: number;
  hasRole: boolean;
}
