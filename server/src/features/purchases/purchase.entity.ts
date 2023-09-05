import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from '../cards/card.entity';

export abstract class PurchaseWithoutAmount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'card_id' })
  cardId: number;

  @ManyToOne(() => Card, { nullable: false })
  @JoinColumn({ name: 'card_id' })
  card: Card;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}

export abstract class PurchaseWithAmount extends PurchaseWithoutAmount {
  @Column()
  amount: number;

  @Column({ nullable: true })
  rate?: number;
}
