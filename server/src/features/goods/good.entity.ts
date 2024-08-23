import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Thing } from '../things/thing.entity';
import { Shop } from '../shops/shop.entity';
import { GoodState } from './good-state.entity';
import { Bargain } from '../bargains/bargain.entity';

@Entity('goods')
export class Good extends Thing {
  @Column({ name: 'shop_id' })
  shopId: number;

  @ManyToOne(() => Shop, { nullable: false })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @OneToMany(() => GoodState, (goodState) => goodState.good)
  states: GoodState[];

  @OneToMany(() => Bargain, (bargain) => bargain.good)
  bargains: Bargain[];

  @AfterLoad()
  setPrice() {
    if (!this.price && this.states) {
      this.price = this.states[0].price;
      delete this.states;
    }
  }
}
