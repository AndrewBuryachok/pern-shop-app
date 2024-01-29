import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Reaction } from '../reactions/reaction.entity';
import { Report } from './report.entity';

@Entity('attitudes')
export class Attitude extends Reaction {
  @Column({ name: 'report_id' })
  reportId: number;

  @ManyToOne(() => Report, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: Report;
}
