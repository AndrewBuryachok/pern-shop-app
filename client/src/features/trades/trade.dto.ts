import { CreatePurchaseDto, RatePurchaseDto } from '../purchases/purchase.dto';

export interface CreateTradeDto extends CreatePurchaseDto {
  wareId: number;
}

export interface RateTradeDto extends RatePurchaseDto {
  tradeId: number;
}
