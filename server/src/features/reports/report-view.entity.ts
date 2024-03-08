import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { View } from '../views/view.entity';
import { Report } from './report.entity';

@Entity('reports_views')
export class ReportView extends View {
  @Column({ name: 'report_id' })
  reportId: number;

  @ManyToOne(() => Report, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: Report;
}
