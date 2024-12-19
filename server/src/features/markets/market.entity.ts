import { Entity, OneToMany } from 'typeorm';
import { PlaceWithCard } from '../places/place.entity';
import { Stall } from '../stalls/stall.entity';
import { MarketTag } from '../markets-tags/market-tag.entity';

@Entity('markets')
export class Market extends PlaceWithCard {
  @OneToMany(() => Stall, (stall) => stall.market)
  stalls: Stall[];

  @OneToMany(() => MarketTag, (tag) => tag.market)
  tags: MarketTag[];
}
