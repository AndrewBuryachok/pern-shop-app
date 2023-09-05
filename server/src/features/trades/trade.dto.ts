import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsTradeExists, IsWareExists } from '../../common/constraints';
import {
  CreatePurchaseWithAmountDto,
  RatePurchaseDto,
} from '../purchases/purchase.dto';

export class TradeIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsTradeExists)
  @Type(() => Number)
  tradeId: number;
}

export class CreateTradeDto extends CreatePurchaseWithAmountDto {
  @ApiProperty()
  @IsId()
  @Validate(IsWareExists)
  wareId: number;
}

export class ExtCreateTradeDto extends CreateTradeDto {
  myId: number;
  hasRole: boolean;
}

export class RateTradeDto extends RatePurchaseDto {}

export class ExtRateTradeDto extends RateTradeDto {
  tradeId: number;
  myId: number;
  hasRole: boolean;
}
