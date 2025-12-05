import { Column, Entity, OneToMany } from 'typeorm';
import { PlaceWithCard } from '../places/place.entity';
import { Good } from '../goods/good.entity';

@Entity('shops')
export class Shop extends PlaceWithCard {
  @Column({ type: 'timestamptz', name: 'completed_at', nullable: true })
  completedAt?: Date;

  @OneToMany(() => Good, (good) => good.shop)
  goods: Good[];
}
