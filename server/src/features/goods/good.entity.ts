import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Thing } from '../things/thing.entity';
import { Card } from '../cards/card.entity';
import { Shop } from '../shops/shop.entity';
import { Rent } from '../rents/rent.entity';
import { Lease } from '../leases/lease.entity';
import { GoodState } from './good-state.entity';
import { Purchase } from '../purchases/purchase.entity';

@Entity('goods')
export class Good extends Thing {
  @Column({ name: 'card_id' })
  cardId: number;

  @ManyToOne(() => Card, { nullable: false })
  @JoinColumn({ name: 'card_id' })
  card: Card;

  @Column({ name: 'shop_id', nullable: true })
  shopId?: number;

  @ManyToOne(() => Shop, { nullable: true })
  @JoinColumn({ name: 'shop_id' })
  shop?: Shop;

  @Column({ name: 'rent_id', nullable: true })
  rentId?: number;

  @ManyToOne(() => Rent, { nullable: true })
  @JoinColumn({ name: 'rent_id' })
  rent?: Rent;

  @Column({ name: 'lease_id', nullable: true })
  leaseId?: number;

  @ManyToOne(() => Lease, { nullable: true })
  @JoinColumn({ name: 'lease_id' })
  lease?: Lease;

  @OneToMany(() => GoodState, (goodState) => goodState.good)
  states: GoodState[];

  @OneToMany(() => Purchase, (purchase) => purchase.good)
  purchases: Purchase[];

  @AfterLoad()
  setPrice() {
    if (!this.price && this.states) {
      this.price = this.states[0].price;
      delete this.states;
    }
  }
}
