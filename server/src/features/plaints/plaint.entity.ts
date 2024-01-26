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
import { Answer } from '../answers/answer.entity';

@Entity('plaints')
export class Plaint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sender_user_id' })
  senderUserId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'sender_user_id' })
  senderUser: User;

  @Column({ name: 'receiver_user_id' })
  receiverUserId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'receiver_user_id' })
  receiverUser: User;

  @Column()
  title: string;

  @Column({ name: 'executor_user_id', nullable: true })
  executorUserId?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'executor_user_id' })
  executorUser?: User;

  @Column({ nullable: true })
  text?: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamptz', name: 'completed_at', nullable: true })
  completedAt?: Date;

  @OneToMany(() => Answer, (answer) => answer.plaint)
  answers: Answer[];
}
