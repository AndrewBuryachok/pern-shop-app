import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { State } from '../states/state.entity';
import { Good } from './good.entity';

@Entity('goods_states')
export class GoodState extends State {
  @Column({ name: 'good_id' })
  goodId: number;

  @ManyToOne(() => Good, { nullable: false })
  @JoinColumn({ name: 'good_id' })
  good: Good;
}
