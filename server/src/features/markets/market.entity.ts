import { Entity, OneToMany } from 'typeorm';
import { PlaceWithCard } from '../places/place.entity';
import { Store } from '../stores/store.entity';

@Entity('markets')
export class Market extends PlaceWithCard {
  @OneToMany(() => Store, (store) => store.market)
  stores: Store[];
}
