import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Reply } from '../replies/reply.entity';
import { Report } from '../reports/report.entity';

@Entity('annotations')
export class Annotation extends Reply {
  @Column({ name: 'report_id' })
  reportId: number;

  @ManyToOne(() => Report, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: Report;

  @Column({ name: 'reply_id', nullable: true })
  replyId?: number;

  @ManyToOne(() => Annotation, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reply_id' })
  reply?: Annotation;
}
