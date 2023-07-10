import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsTradeExists, IsWareExists } from '../../common/constraints';
import { CreatePurchaseDto, RatePurchaseDto } from '../purchases/purchase.dto';

export class TradeIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsTradeExists)
  @Type(() => Number)
  tradeId: number;
}

export class CreateTradeDto extends CreatePurchaseDto {
  @ApiProperty()
  @IsId()
  @Validate(IsWareExists)
  wareId: number;
}

export class ExtCreateTradeDto extends CreateTradeDto {
  myId: number;
}

export class RateTradeDto extends RatePurchaseDto {}

export class ExtRateTradeDto extends RateTradeDto {
  tradeId: number;
  myId: number;
}
