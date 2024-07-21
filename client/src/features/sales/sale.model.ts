import { Purchase } from '../purchases/purchase.model';
import { SmProduct } from '../products/product.model';

export interface Sale extends Purchase {
  product: SmProduct;
}
