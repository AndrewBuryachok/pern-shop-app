import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PurchaseWithAmount } from '../purchases/purchase.entity';
import { Product } from '../products/product.entity';

@Entity('sales')
export class Sale extends PurchaseWithAmount {
  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
