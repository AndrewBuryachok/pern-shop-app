import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('ratings')
export class Rating {
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
  rate: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
