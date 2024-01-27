import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Reply } from '../replies/reply.entity';
import { Poll } from '../polls/poll.entity';

@Entity('discussions')
export class Discussion extends Reply {
  @Column({ name: 'poll_id' })
  pollId: number;

  @ManyToOne(() => Poll, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poll_id' })
  poll: Poll;

  @Column({ name: 'reply_id', nullable: true })
  replyId?: number;

  @ManyToOne(() => Discussion, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reply_id' })
  reply?: Discussion;
}
