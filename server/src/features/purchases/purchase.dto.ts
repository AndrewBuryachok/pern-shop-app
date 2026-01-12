import { ApiProperty } from '@nestjs/swagger';
import { Validate, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { IsAmount, IsId, IsRate, IsSum } from '../../common/decorators';
import {
  IsCardExists,
  IsGoodExists,
  IsPurchaseExists,
  IsStationExists,
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
  @Validate(IsGoodExists)
  goodId: number;

  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;

  @ApiProperty()
  @IsAmount()
  amount: number;

  @ApiProperty()
  @ValidateIf((_, value) => value !== 0)
  @IsRate()
  rate: number;

  @ApiProperty()
  @ValidateIf((_, value) => value !== 0)
  @IsId()
  @Validate(IsStationExists)
  stationId: number;

  @ApiProperty()
  @ValidateIf((_, value) => value !== 0)
  @IsSum()
  sum: number;
}

export class ExtCreatePurchaseDto extends CreatePurchaseDto {
  myId: number;
  hasRole: boolean;
}
