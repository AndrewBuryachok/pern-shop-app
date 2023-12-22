import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { Thing } from '../things/thing.entity';
import { Card } from '../cards/card.entity';
import { Status } from './status.enum';

export abstract class Transportation extends Thing {
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

  @Column({ nullable: true })
  rate?: number;
}
