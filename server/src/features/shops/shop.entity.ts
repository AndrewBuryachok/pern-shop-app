import { Entity, OneToMany } from 'typeorm';
import { PlaceWithUser } from '../places/place.entity';
import { Good } from '../goods/good.entity';

@Entity('shops')
export class Shop extends PlaceWithUser {
  @OneToMany(() => Good, (good) => good.shop)
  goods: Good[];
}
