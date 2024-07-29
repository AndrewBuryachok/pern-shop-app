import {
  CreateHaulageDto,
  EditHaulageDto,
  RateHaulageDto,
  TakeHaulageDto,
} from '../haulages/haulage.dto';

export interface CreateStorageDeliveryDto extends CreateHaulageDto {
  saleId: number;
}

export interface EditStorageDeliveryDto extends EditHaulageDto {
  storageDeliveryId: number;
}

export interface TakeStorageDeliveryDto extends TakeHaulageDto {
  storageDeliveryId: number;
}

export interface StorageDeliveryIdDto {
  storageDeliveryId: number;
}

export interface RateStorageDeliveryDto extends RateHaulageDto {
  storageDeliveryId: number;
}
