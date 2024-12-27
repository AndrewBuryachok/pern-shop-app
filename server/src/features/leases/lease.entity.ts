import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Receipt } from '../receipts/receipt.entity';
import { Cell } from '../cells/cell.entity';
import { Good } from '../goods/good.entity';

@Entity('leases')
export class Lease extends Receipt {
  @Column({ name: 'cell_id' })
  cellId: number;

  @ManyToOne(() => Cell, { nullable: false })
  @JoinColumn({ name: 'cell_id' })
  cell: Cell;

  @OneToMany(() => Good, (good) => good.lease)
  goods: Good[];
}
