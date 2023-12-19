import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.enum';
import { City } from '../cities/city.entity';
import { Shop } from '../shops/shop.entity';
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
  status: boolean;

  @Column({ type: 'enum', enum: Role, array: true, default: [] })
  roles: Role[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'city_id', nullable: true })
  cityId?: number;

  @ManyToOne(() => City, { nullable: true })
  @JoinColumn({ name: 'city_id' })
  city?: City;

  @OneToMany(() => Shop, (shop) => shop.user)
  shops: Shop[];

  @OneToMany(() => Card, (card) => card.user)
  cards: Card[];

  @OneToMany(() => Rating, (rating) => rating.receiverUser)
  ratings: Rating[];
}
