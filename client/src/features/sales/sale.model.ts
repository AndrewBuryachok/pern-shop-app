import { Purchase, SmPurchase } from '../purchases/purchase.model';
import {
  MdProduct,
  SmProduct,
  SmProductWithoutPrice,
} from '../products/product.model';

export interface SmSaleWithoutPrice extends SmPurchase {
  product: SmProductWithoutPrice;
}

export interface SmSale extends SmPurchase {
  product: SmProduct;
}

export interface Sale extends Purchase {
  product: MdProduct;
}
