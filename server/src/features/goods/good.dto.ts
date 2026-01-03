import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsGoodExists, IsShopExists } from '../../common/constraints';
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

export class ExtGoodIdDto extends GoodIdDto {
  myId: number;
  hasRole: boolean;
}

export class CreateGoodDto extends CreateThingDto {
  @ApiProperty()
  @IsId()
  @Validate(IsShopExists)
  shopId: number;
}

export class ExtCreateGoodDto extends CreateGoodDto {
  myId: number;
  hasRole: boolean;
}

export class EditGoodDto extends CreateThingDto {}

export class ExtEditGoodDto extends EditGoodDto {
  goodId: number;
  myId: number;
  hasRole: boolean;
}

export class UpdateGoodDto extends ExtEditStateDto {}

export class ExtUpdateGoodDto extends UpdateGoodDto {
  goodId: number;
  myId: number;
  hasRole: boolean;
}

export class BuyGoodDto extends ExtCreatePurchaseDto {}
