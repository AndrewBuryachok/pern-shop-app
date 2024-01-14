import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { PlaceWithUser } from '../places/place.entity';
import { User } from '../users/user.entity';
import { Good } from '../goods/good.entity';

@Entity('shops')
export class Shop extends PlaceWithUser {
  @ManyToMany(() => User)
  @JoinTable({
    name: 'shops_users',
    joinColumn: { name: 'shop_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users: User[];

  @OneToMany(() => Good, (good) => good.shop)
  goods: Good[];
}
