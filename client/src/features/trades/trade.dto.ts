import {
  CreatePurchaseWithAmountDto,
  RatePurchaseDto,
} from '../purchases/purchase.dto';

export interface CreateTradeDto extends CreatePurchaseWithAmountDto {
  wareId: number;
}

export interface RateTradeDto extends RatePurchaseDto {
  tradeId: number;
}
