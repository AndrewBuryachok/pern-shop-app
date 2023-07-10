import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsAmount, IsId, IsRate } from '../../common/decorators';
import { IsCardExists } from '../../common/constraints';

export class CreatePurchaseDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;

  @ApiProperty()
  @IsAmount()
  amount: number;
}

export class RatePurchaseDto {
  @ApiProperty()
  @IsRate()
  rate: number;
}
