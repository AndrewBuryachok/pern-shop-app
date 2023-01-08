import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Thing } from '../things/thing.entity';
import { Shop } from '../shops/shop.entity';

@Entity('goods')
export class Good extends Thing {
  @Column({ name: 'shop_id' })
  shopId: number;

  @ManyToOne(() => Shop, { nullable: false })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;
}
