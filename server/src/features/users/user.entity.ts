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
import { Town } from '../towns/town.entity';
import { Card } from '../cards/card.entity';

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

  @Column({ default: '' })
  avatar: string;

  @Column({ default: 1 })
  background: number;

  @Column({ default: '' })
  discord: string;

  @Column({ default: '' })
  twitch: string;

  @Column({ default: '' })
  youtube: string;

  @Column({ default: false })
  banned: boolean;

  @Column({ type: 'enum', enum: Role, array: true, default: [] })
  roles: Role[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamptz', name: 'online_at', nullable: true })
  onlineAt?: Date;

  @Column({ default: false })
  type: boolean;

  @Column({ default: 0 })
  attempts: number;

  @Column({ type: 'timestamptz', name: 'blocked_until', nullable: true })
  blockedUntil?: Date;

  @Column({ name: 'town_id', nullable: true })
  townId?: number;

  @ManyToOne(() => Town, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'town_id' })
  town?: Town;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'friends',
    joinColumn: { name: 'sender_user_id' },
    inverseJoinColumn: { name: 'receiver_user_id' },
  })
  friends: User[];

  @OneToMany(() => Card, (card) => card.user)
  cards: Card[];
}
