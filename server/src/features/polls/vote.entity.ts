import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Reaction } from '../reactions/reaction.entity';
import { Poll } from './poll.entity';

@Entity('votes')
export class Vote extends Reaction {
  @Column({ name: 'poll_id' })
  pollId: number;

  @ManyToOne(() => Poll, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poll_id' })
  poll: Poll;
}
