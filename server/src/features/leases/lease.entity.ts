import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Receipt } from '../receipts/receipt.entity';
import { Cell } from '../cells/cell.entity';
import { Kind } from './kind.enum';

@Entity('leases')
export class Lease extends Receipt {
  @Column({ name: 'cell_id' })
  cellId: number;

  @ManyToOne(() => Cell, { nullable: false })
  @JoinColumn({ name: 'cell_id' })
  cell: Cell;

  @Column({ type: 'enum', enum: Kind, default: Kind.PRODUCT })
  kind: Kind;
}
