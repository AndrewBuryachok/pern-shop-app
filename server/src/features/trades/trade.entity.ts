import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Purchase } from '../purchases/purchase.entity';
import { Ware } from '../wares/ware.entity';

@Entity('trades')
export class Trade extends Purchase {
  @Column({ name: 'ware_id' })
  wareId: number;

  @ManyToOne(() => Ware, { nullable: false })
  @JoinColumn({ name: 'ware_id' })
  ware: Ware;
}
