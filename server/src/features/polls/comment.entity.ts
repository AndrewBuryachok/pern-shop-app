import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Reply } from '../replies/reply.entity';
import { Poll } from './poll.entity';

@Entity('polls_comments')
export class PollComment extends Reply {
  @Column({ name: 'poll_id' })
  pollId: number;

  @ManyToOne(() => Poll, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poll_id' })
  poll: Poll;

  @Column({ name: 'reply_id', nullable: true })
  replyId?: number;

  @ManyToOne(() => PollComment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reply_id' })
  reply?: PollComment;
}
