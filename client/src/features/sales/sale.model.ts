import { Purchase } from '../purchases/purchase.model';
import { MdProduct } from '../products/product.model';

export interface Sale extends Purchase {
  product: MdProduct;
}
