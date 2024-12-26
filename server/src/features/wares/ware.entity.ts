import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Thing } from '../things/thing.entity';
import { Rent } from '../rents/rent.entity';
import { WareState } from './ware-state.entity';
import { Purchase } from '../purchases/purchase.entity';

@Entity('wares')
export class Ware extends Thing {
  @Column({ name: 'rent_id' })
  rentId: number;

  @ManyToOne(() => Rent, { nullable: false })
  @JoinColumn({ name: 'rent_id' })
  rent: Rent;

  @OneToMany(() => WareState, (wareState) => wareState.ware)
  states: WareState[];

  @OneToMany(() => Purchase, (purchase) => purchase.ware)
  purchases: Purchase[];

  @AfterLoad()
  setPrice() {
    if (!this.price && this.states) {
      this.price = this.states[0].price;
      delete this.states;
    }
  }
}
