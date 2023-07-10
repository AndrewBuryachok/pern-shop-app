import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Priority } from './priority.enum';
import { TransportationStatus } from '../transportations/transportation-status.enum';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_user_id' })
  customerUserId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'customer_user_id' })
  customerUser: User;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.MEDIUM,
  })
  priority: Priority;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'executor_user_id', nullable: true })
  executorUserId?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'executor_user_id' })
  executorUser?: User;

  @Column({ type: 'timestamptz', name: 'completed_at', nullable: true })
  completedAt?: Date;

  @Column({
    type: 'enum',
    enum: TransportationStatus,
    default: TransportationStatus.CREATED,
  })
  status: TransportationStatus;
}
