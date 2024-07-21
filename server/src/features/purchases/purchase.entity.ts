import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from '../cards/card.entity';

export abstract class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'card_id' })
  cardId: number;

  @ManyToOne(() => Card, { nullable: false })
  @JoinColumn({ name: 'card_id' })
  card: Card;

  @Column()
  amount: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: true })
  rate?: number;
}
