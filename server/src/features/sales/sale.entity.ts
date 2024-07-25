import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Purchase } from '../purchases/purchase.entity';
import { Product } from '../products/product.entity';
import { StorageDelivery } from '../storages-deliveries/storage-delivery.entity';

@Entity('sales')
export class Sale extends Purchase {
  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => StorageDelivery, (storageDelivery) => storageDelivery.sale)
  deliveries: StorageDelivery[];
}
