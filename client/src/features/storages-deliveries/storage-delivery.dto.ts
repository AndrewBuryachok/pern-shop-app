import {
  CreateDeliveryDto,
  EditDeliveryDto,
  RateDeliveryDto,
  TakeDeliveryDto,
} from '../deliveries/delivery.dto';

export interface CreateStorageDeliveryDto extends CreateDeliveryDto {
  saleId: number;
}

export interface EditStorageDeliveryDto extends EditDeliveryDto {
  storageDeliveryId: number;
}

export interface TakeStorageDeliveryDto extends TakeDeliveryDto {
  storageDeliveryId: number;
}

export interface StorageDeliveryIdDto {
  storageDeliveryId: number;
}

export interface RateStorageDeliveryDto extends RateDeliveryDto {
  storageDeliveryId: number;
}
