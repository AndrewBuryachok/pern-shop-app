import { PurchaseWithAmount } from '../purchases/purchase.model';
import { MdProduct } from '../products/product.model';

export interface Sale extends PurchaseWithAmount {
  product: MdProduct;
}
