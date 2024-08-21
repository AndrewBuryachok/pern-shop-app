import { Entity, OneToMany } from 'typeorm';
import { PlaceWithCard } from '../places/place.entity';
import { Good } from '../goods/good.entity';

@Entity('shops')
export class Shop extends PlaceWithCard {
  @OneToMany(() => Good, (good) => good.shop)
  goods: Good[];
}
