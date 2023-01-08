import { Purchase } from '../purchases/purchase.entity';
import { Product } from '../products/product.entity';

export class Sale extends Purchase {
  productId: number;
  product: Product;
}
