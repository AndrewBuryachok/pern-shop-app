import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PurchaseWithoutAmount } from '../purchases/purchase.entity';
import { Lot } from '../lots/lot.entity';

@Entity('bids')
export class Bid extends PurchaseWithoutAmount {
  @Column({ name: 'lot_id' })
  lotId: number;

  @ManyToOne(() => Lot, { nullable: false })
  @JoinColumn({ name: 'lot_id' })
  lot: Lot;

  @Column()
  price: number;
}
