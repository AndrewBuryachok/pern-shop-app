import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from '../cards/card.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sender_card_id' })
  senderCardId: number;

  @ManyToOne(() => Card, { nullable: false })
  @JoinColumn({ name: 'sender_card_id' })
  senderCard: Card;

  @Column({ name: 'receiver_card_id' })
  receiverCardId: number;

  @ManyToOne(() => Card, { nullable: false })
  @JoinColumn({ name: 'receiver_card_id' })
  receiverCard: Card;

  @Column()
  sum: number;

  @Column()
  description: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
