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
import { Attitude } from './attitude.entity';
import { Annotation } from '../annotations/annotation.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  text: string;

  @Column()
  image1: string;

  @Column()
  image2: string;

  @Column()
  image3: string;

  @Column()
  video: string;

  @Column({
    type: 'enum',
    enum: Mark,
    default: Mark.SERVER,
  })
  mark: Mark;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Attitude, (attitude) => attitude.report)
  attitudes: Attitude[];

  @OneToMany(() => Annotation, (annotation) => annotation.report)
  annotations: Annotation[];
}
