import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from '../cards/card.entity';
import { Good } from '../goods/good.entity';
import { Delivery } from '../deliveries/delivery.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'good_id' })
  goodId: number;

  @ManyToOne(() => Good, { nullable: false })
  @JoinColumn({ name: 'good_id' })
  good: Good;

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

  @OneToOne(() => Delivery, (delivery) => delivery.purchase)
  delivery: Delivery;
}
