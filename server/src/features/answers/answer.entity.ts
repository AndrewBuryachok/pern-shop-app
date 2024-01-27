import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Reply } from '../replies/reply.entity';
import { Plaint } from '../plaints/plaint.entity';

@Entity('answers')
export class Answer extends Reply {
  @Column({ name: 'plaint_id' })
  plaintId: number;

  @ManyToOne(() => Plaint, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plaint_id' })
  plaint: Plaint;
}
