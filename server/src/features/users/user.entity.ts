import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.enum';
import { City } from '../cities/city.entity';
import { Card } from '../cards/card.entity';
import { Rating } from '../ratings/rating.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nick: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ default: false })
  type: boolean;

  @Column({ type: 'enum', enum: Role, array: true, default: [] })
  roles: Role[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'city_id', nullable: true })
  cityId?: number;

  @ManyToOne(() => City, { nullable: true })
  @JoinColumn({ name: 'city_id' })
  city?: City;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'friends',
    joinColumn: { name: 'sender_user_id' },
    inverseJoinColumn: { name: 'receiver_user_id' },
  })
  friends: User[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'subscribers',
    joinColumn: { name: 'sender_user_id' },
    inverseJoinColumn: { name: 'receiver_user_id' },
  })
  sentSubscribers: User[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'subscribers',
    joinColumn: { name: 'receiver_user_id' },
    inverseJoinColumn: { name: 'sender_user_id' },
  })
  receivedSubscribers: User[];

  @OneToMany(() => Card, (card) => card.user)
  cards: Card[];

  @OneToMany(() => Rating, (rating) => rating.receiverUser)
  ratings: Rating[];
}
