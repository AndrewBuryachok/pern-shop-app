import { SmHire } from '../hires/hire.model';
import { MdCard } from '../cards/card.model';
import { SmBargainWithoutPrice } from '../bargains/bargain.model';
import { SmTradeWithoutPrice } from '../trades/trade.model';
import { SmSaleWithoutPrice } from '../sales/sale.model';

export interface Delivery {
  id: number;
  hire: SmHire;
  bargain?: SmBargainWithoutPrice;
  trade?: SmTradeWithoutPrice;
  sale?: SmSaleWithoutPrice;
  price: number;
  status: number;
  executorCard?: MdCard;
  createdAt: Date;
  completedAt?: Date;
  rate?: number;
}
