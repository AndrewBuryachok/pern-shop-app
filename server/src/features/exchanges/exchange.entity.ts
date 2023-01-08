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

@Entity('exchanges')
export class Exchange {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'executor_user_id' })
  executorUserId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'executor_user_id' })
  executorUser: User;

  @Column({ name: 'customer_card_id' })
  customerCardId: number;

  @ManyToOne(() => Card, { nullable: false })
  @JoinColumn({ name: 'customer_card_id' })
  customerCard: Card;

  @Column()
  type: boolean;

  @Column()
  sum: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
