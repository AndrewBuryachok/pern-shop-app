import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Thing } from '../things/thing.entity';
import { Lease } from '../leases/lease.entity';
import { ProductState } from './product-state.entity';

@Entity('products')
export class Product extends Thing {
  @Column({ name: 'lease_id' })
  leaseId: number;

  @OneToOne(() => Lease, { nullable: false })
  @JoinColumn({ name: 'lease_id' })
  lease: Lease;

  @OneToMany(() => ProductState, (productState) => productState.product)
  states: ProductState[];

  @AfterLoad()
  setPrice() {
    if (!this.price && this.states) {
      this.price = this.states[0].price;
      delete this.states;
    }
  }
}
