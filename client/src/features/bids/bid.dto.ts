import { CreatePurchaseWithPriceDto } from '../purchases/purchase.dto';

export interface CreateBidDto extends CreatePurchaseWithPriceDto {
  lotId: number;
}
