import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { Thing } from '../things/thing.entity';
import { Card } from '../cards/card.entity';
import { TransportationStatus } from './transportation-status.enum';

export abstract class Transportation extends Thing {
  @Column({ name: 'executor_card_id', nullable: true })
  executorCardId?: number;

  @ManyToOne(() => Card, { nullable: true })
  @JoinColumn({ name: 'executor_card_id' })
  executorCard?: Card;

  @Column({ type: 'timestamptz', name: 'completed_at', nullable: true })
  completedAt?: Date;

  @Column({
    type: 'enum',
    enum: TransportationStatus,
    default: TransportationStatus.CREATED,
  })
  status: TransportationStatus;

  @Column({ nullable: true })
  rate?: number;
}
