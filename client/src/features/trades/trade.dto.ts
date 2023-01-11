import { CreatePurchaseDto } from '../purchases/purchase.dto';

export interface CreateTradeDto extends CreatePurchaseDto {
  wareId: number;
}
