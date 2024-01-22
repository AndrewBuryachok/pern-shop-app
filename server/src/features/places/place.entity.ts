import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Card } from '../cards/card.entity';

export abstract class Place {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  video: string;

  @Column()
  description: string;

  @Column()
  x: number;

  @Column()
  y: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}

export abstract class PlaceWithUser extends Place {
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

export abstract class PlaceWithCard extends Place {
  @Column({ name: 'card_id' })
  cardId: number;

  @ManyToOne(() => Card, { nullable: false })
  @JoinColumn({ name: 'card_id' })
  card: Card;

  @Column()
  price: number;
}
