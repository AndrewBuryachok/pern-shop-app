import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Tag } from '../tags/tag.entity';
import { Market } from '../markets/market.entity';
import { Store } from '../stores/store.entity';
import { MarketTagState } from './market-tag-state.entity';

@Entity('markets_tags')
export class MarketTag extends Tag {
  @Column({ name: 'market_id' })
  marketId: number;

  @ManyToOne(() => Market, { nullable: false })
  @JoinColumn({ name: 'market_id' })
  market: Market;

  @OneToMany(() => Store, (store) => store.marketTag)
  stores: Store[];

  @OneToMany(() => MarketTagState, (state) => state.marketTag)
  states: MarketTagState[];

  @AfterLoad()
  setPrice() {
    if (!this.price && this.states) {
      this.price = this.states[0].price;
      delete this.states;
    }
  }
}
