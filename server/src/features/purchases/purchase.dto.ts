import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsAmount, IsId, IsPrice, IsRate } from '../../common/decorators';
import { IsCardExists } from '../../common/constraints';

export abstract class CreatePurchaseDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;
}

export abstract class CreatePurchaseWithAmountDto extends CreatePurchaseDto {
  @ApiProperty()
  @IsAmount()
  amount: number;
}

export abstract class CreatePurchaseWithPriceDto extends CreatePurchaseDto {
  @ApiProperty()
  @IsPrice()
  price: number;
}

export abstract class RatePurchaseDto {
  @ApiProperty()
  @IsRate()
  rate: number;
}
