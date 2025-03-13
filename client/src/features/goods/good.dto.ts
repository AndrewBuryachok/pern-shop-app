import { CreateThingDto } from '../things/thing.dto';
import { EditStateDto } from '../states/state.dto';

export interface CreateShopGoodDto extends CreateThingDto {
  shopId: number;
}

export interface CreateMarketGoodDto extends CreateThingDto {
  rentId: number;
}

export interface CreateStorageGoodDto extends CreateThingDto {
  leaseId: number;
}

export type CreateAnyGoodDto = CreateShopGoodDto &
  CreateMarketGoodDto &
  CreateStorageGoodDto;

export interface EditGoodDto extends CreateThingDto {
  goodId: number;
}

export interface UpdateGoodDto extends EditStateDto {
  goodId: number;
}

export interface GoodIdDto {
  goodId: number;
}
