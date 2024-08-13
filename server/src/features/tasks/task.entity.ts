import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Service } from '../services/service.entity';
import { Card } from '../cards/card.entity';
import { Status } from '../transportations/status.enum';

@Entity('tasks')
export class Task extends Service {
  @Column({ name: 'customer_card_id' })
  customerCardId: number;

  @ManyToOne(() => Card, { nullable: false })
  @JoinColumn({ name: 'customer_card_id' })
  customerCard: Card;

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

  @Column({ type: 'timestamptz', name: 'completed_at', nullable: true })
  completedAt?: Date;

  @Column({ nullable: true })
  rate?: number;
}
