import { Entity, JoinTable, ManyToMany } from 'typeorm';
import { PlaceWithUser } from '../places/place.entity';
import { User } from '../users/user.entity';

@Entity('farms')
export class Farm extends PlaceWithUser {
  @ManyToMany(() => User)
  @JoinTable({
    name: 'farms_users',
    joinColumn: { name: 'farm_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users: User[];
}
