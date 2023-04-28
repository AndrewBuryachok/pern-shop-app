import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  name: string;

  @Column()
  color: number;

  @Column({ default: 0 })
  balance: number;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'cards_users',
    joinColumn: { name: 'card_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users: User[];
}
