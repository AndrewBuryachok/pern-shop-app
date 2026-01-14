import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Card } from '../cards/card.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'executor_user_id', nullable: true })
  executorUserId?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'executor_user_id' })
  executorUser?: User;

  @Column({ name: 'sender_card_id', nullable: true })
  senderCardId?: number;

  @ManyToOne(() => Card, { nullable: true })
  @JoinColumn({ name: 'sender_card_id' })
  senderCard?: Card;

  @Column({ name: 'receiver_card_id', nullable: true })
  receiverCardId?: number;

  @ManyToOne(() => Card, { nullable: true })
  @JoinColumn({ name: 'receiver_card_id' })
  receiverCard?: Card;

  @Column()
  sum: number;

  @Column()
  description: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
