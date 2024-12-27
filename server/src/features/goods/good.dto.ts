import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import {
  IsGoodExists,
  IsLeaseExists,
  IsRentExists,
  IsShopExists,
} from '../../common/constraints';
import { CreateThingDto } from '../things/thing.dto';
import { ExtEditStateDto } from '../states/state.dto';
import { ExtCreatePurchaseDto } from '../purchases/purchase.dto';

export class GoodIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsGoodExists)
  @Type(() => Number)
  goodId: number;
}

export class CreateShopGoodDto extends CreateThingDto {
  @ApiProperty()
  @IsId()
  @Validate(IsShopExists)
  shopId: number;
}

export class ExtCreateShopGoodDto extends CreateShopGoodDto {
  myId: number;
  hasRole: boolean;
}

export class CreateMarketGoodDto extends CreateThingDto {
  @ApiProperty()
  @IsId()
  @Validate(IsRentExists)
  rentId: number;
}

export class ExtCreateMarketGoodDto extends CreateMarketGoodDto {
  myId: number;
  hasRole: boolean;
}

export class CreateStorageGoodDto extends CreateThingDto {
  @ApiProperty()
  @IsId()
  @Validate(IsLeaseExists)
  leaseId: number;
}

export class ExtCreateStorageGoodDto extends CreateStorageGoodDto {
  myId: number;
  hasRole: boolean;
}

export class EditGoodDto extends ExtEditStateDto {}

export class ExtEditGoodDto extends EditGoodDto {
  goodId: number;
  myId: number;
  hasRole: boolean;
}

export class CompleteGoodDto extends GoodIdDto {
  myId: number;
  hasRole: boolean;
}

export class BuyGoodDto extends ExtCreatePurchaseDto {}
