import { CreatePurchaseDto, RatePurchaseDto } from '../purchases/purchase.dto';

export interface CreateBargainDto extends CreatePurchaseDto {
  goodId: number;
}

export interface RateBargainDto extends RatePurchaseDto {
  bargainId: number;
}

export interface DeleteBargainDto {
  bargainId: number;
}
