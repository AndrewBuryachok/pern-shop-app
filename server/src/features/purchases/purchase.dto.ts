import { ApiProperty } from '@nestjs/swagger';
import { Validate, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { IsAmount, IsId, IsPrice, IsRate } from '../../common/decorators';
import {
  IsCardExists,
  IsGoodExists,
  IsProductExists,
  IsPurchaseExists,
  IsStationExists,
  IsWareExists,
} from '../../common/constraints';

export class PurchaseIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsPurchaseExists)
  @Type(() => Number)
  purchaseId: number;
}

export class CreatePurchaseDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;

  @ApiProperty()
  @IsAmount()
  amount: number;

  @ApiProperty()
  @ValidateIf((_, value) => value !== 0)
  @IsId()
  @Validate(IsStationExists)
  stationId: number;

  @ApiProperty()
  @ValidateIf((_, value) => value !== 0)
  @IsPrice()
  price: number;
}

export class CreateShopPurchaseDto extends CreatePurchaseDto {
  @ApiProperty()
  @IsId()
  @Validate(IsGoodExists)
  goodId: number;
}

export class ExtCreateShopPurchaseDto extends CreateShopPurchaseDto {
  myId: number;
  hasRole: boolean;
}

export class CreateMarketPurchaseDto extends CreatePurchaseDto {
  @ApiProperty()
  @IsId()
  @Validate(IsWareExists)
  wareId: number;
}

export class ExtCreateMarketPurchaseDto extends CreateMarketPurchaseDto {
  myId: number;
  hasRole: boolean;
}

export class CreateStoragePurchaseDto extends CreatePurchaseDto {
  @ApiProperty()
  @IsId()
  @Validate(IsProductExists)
  productId: number;
}

export class ExtCreateStoragePurchaseDto extends CreateStoragePurchaseDto {
  myId: number;
  hasRole: boolean;
}

export class RatePurchaseDto {
  @ApiProperty()
  @IsRate()
  rate: number;
}

export class ExtRatePurchaseDto extends RatePurchaseDto {
  purchaseId: number;
  myId: number;
  hasRole: boolean;
}
