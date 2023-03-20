import { Entity, OneToMany } from 'typeorm';
import { PlaceWithUser } from '../places/place.entity';
import { User } from '../users/user.entity';

@Entity('cities')
export class City extends PlaceWithUser {
  @OneToMany(() => User, (user) => user.city)
  users: User[];
}
