import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { State } from '../states/state.entity';
import { Ware } from './ware.entity';

@Entity('wares_states')
export class WareState extends State {
  @Column({ name: 'ware_id' })
  wareId: number;

  @ManyToOne(() => Ware, { nullable: false })
  @JoinColumn({ name: 'ware_id' })
  ware: Ware;
}
