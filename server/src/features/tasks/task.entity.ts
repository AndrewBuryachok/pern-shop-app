import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Thing } from '../things/thing.entity';
import { User } from '../users/user.entity';
import { Status } from '../transportations/status.enum';

@Entity('tasks')
export class Task extends Thing {
  @Column({ name: 'customer_user_id' })
  customerUserId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'customer_user_id' })
  customerUser: User;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.CREATED,
  })
  status: Status;

  @Column({ name: 'executor_user_id', nullable: true })
  executorUserId?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'executor_user_id' })
  executorUser?: User;
}
