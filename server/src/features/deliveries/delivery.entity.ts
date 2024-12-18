import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from '../cards/card.entity';
import { Status } from '../transportations/status.enum';

export abstract class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.CREATED,
  })
  status: Status;

  @Column({ name: 'executor_card_id', nullable: true })
  executorCardId?: number;

  @ManyToOne(() => Card, { nullable: true })
  @JoinColumn({ name: 'executor_card_id' })
  executorCard?: Card;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamptz', name: 'completed_at', nullable: true })
  completedAt?: Date;

  @Column({ nullable: true })
  rate?: number;
}
