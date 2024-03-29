import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsProductExists, IsSaleExists } from '../../common/constraints';
import {
  CreatePurchaseWithAmountDto,
  RatePurchaseDto,
} from '../purchases/purchase.dto';

export class SaleIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsSaleExists)
  @Type(() => Number)
  saleId: number;
}

export class CreateSaleDto extends CreatePurchaseWithAmountDto {
  @ApiProperty()
  @IsId()
  @Validate(IsProductExists)
  productId: number;
}

export class ExtCreateSaleDto extends CreateSaleDto {
  myId: number;
  hasRole: boolean;
}

export class RateSaleDto extends RatePurchaseDto {}

export class ExtRateSaleDto extends RateSaleDto {
  saleId: number;
  myId: number;
  hasRole: boolean;
}
