import { AfterLoad, Entity, OneToMany } from 'typeorm';
import { PlaceWithCard } from '../places/place.entity';
import { Store } from '../stores/store.entity';
import { MarketState } from './market-state.entity';

@Entity('markets')
export class Market extends PlaceWithCard {
  @OneToMany(() => Store, (store) => store.market)
  stores: Store[];

  @OneToMany(() => MarketState, (state) => state.market)
  states: MarketState[];

  @AfterLoad()
  setPrice() {
    if (!this.price && this.states) {
      this.price = this.states[0].price;
      delete this.states;
    }
  }
}
