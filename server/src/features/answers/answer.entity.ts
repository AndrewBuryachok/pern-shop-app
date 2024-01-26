import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Plaint } from '../plaints/plaint.entity';
import { User } from '../users/user.entity';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'plaint_id' })
  plaintId: number;

  @ManyToOne(() => Plaint, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plaint_id' })
  plaint: Plaint;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  text: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
