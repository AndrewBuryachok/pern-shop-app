import { Entity, OneToMany } from 'typeorm';
import { PlaceWithCard } from '../places/place.entity';
import { Store } from '../stores/store.entity';
import { MarketTag } from '../markets-tags/market-tag.entity';

@Entity('markets')
export class Market extends PlaceWithCard {
  @OneToMany(() => Store, (store) => store.market)
  stores: Store[];

  @OneToMany(() => MarketTag, (tag) => tag.market)
  tags: MarketTag[];
}
