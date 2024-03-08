import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { View } from '../views/view.entity';
import { Poll } from './poll.entity';

@Entity('polls_views')
export class PollView extends View {
  @Column({ name: 'poll_id' })
  pollId: number;

  @ManyToOne(() => Poll, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poll_id' })
  poll: Poll;
}
