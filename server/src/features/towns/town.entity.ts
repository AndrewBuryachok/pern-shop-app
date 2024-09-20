import { Entity, OneToMany } from 'typeorm';
import { PlaceWithUser } from '../places/place.entity';
import { User } from '../users/user.entity';

@Entity('towns')
export class Town extends PlaceWithUser {
  @OneToMany(() => User, (user) => user.town)
  users: User[];
}
