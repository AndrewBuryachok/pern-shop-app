import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Mark } from './mark.enum';
import { Result } from './result.enum';
import { PollView } from './poll-view.entity';
import { Vote } from './vote.entity';
import { Discussion } from '../discussions/discussion.entity';

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  text: string;

  @Column({
    type: 'enum',
    enum: Mark,
    default: Mark.SITE,
  })
  mark: Mark;

  @Column()
  image: string;

  @Column()
  video: string;

  @Column({
    type: 'enum',
    enum: Result,
    default: Result.PROGRESS,
  })
  result: Result;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamptz', name: 'completed_at', nullable: true })
  completedAt?: Date;

  @OneToMany(() => PollView, (view) => view.poll)
  views: PollView[];

  @OneToMany(() => Vote, (vote) => vote.poll)
  votes: Vote[];

  @OneToMany(() => Discussion, (discussion) => discussion.poll)
  discussions: Discussion[];
}
