import { PurchaseWithAmount } from '../purchases/purchase.model';
import { SmProduct } from '../products/product.model';

export interface Sale extends PurchaseWithAmount {
  product: SmProduct;
}
