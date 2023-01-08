import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Poll } from '../polls/poll.entity';
import { User } from '../users/user.entity';

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'poll_id' })
  pollId: number;

  @ManyToOne(() => Poll, { nullable: false })
  @JoinColumn({ name: 'poll_id' })
  poll: Poll;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  type: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
