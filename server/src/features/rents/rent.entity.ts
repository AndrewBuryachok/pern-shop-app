import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Receipt } from '../receipts/receipt.entity';
import { Store } from '../stores/store.entity';
import { Ware } from '../wares/ware.entity';

@Entity('rents')
export class Rent extends Receipt {
  @Column({ name: 'store_id' })
  storeId: number;

  @ManyToOne(() => Store, { nullable: false })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @OneToMany(() => Ware, (ware) => ware.rent)
  wares: Ware[];
}
