import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Thing } from '../things/thing.entity';
import { Lease } from '../leases/lease.entity';
import { ProductState } from './product-state.entity';
import { Purchase } from '../purchases/purchase.entity';

@Entity('products')
export class Product extends Thing {
  @Column({ name: 'lease_id' })
  leaseId: number;

  @ManyToOne(() => Lease, { nullable: false })
  @JoinColumn({ name: 'lease_id' })
  lease: Lease;

  @OneToMany(() => ProductState, (productState) => productState.product)
  states: ProductState[];

  @OneToMany(() => Purchase, (purchase) => purchase.product)
  purchases: Purchase[];

  @AfterLoad()
  setPrice() {
    if (!this.price && this.states) {
      this.price = this.states[0].price;
      delete this.states;
    }
  }
}
