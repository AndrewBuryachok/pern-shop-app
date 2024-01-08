import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Receipt } from '../receipts/receipt.entity';
import { Cell } from '../cells/cell.entity';
import { Kind } from './kind.enum';
import { Product } from '../products/product.entity';
import { Lot } from '../lots/lot.entity';
import { Order } from '../orders/order.entity';
import { Delivery } from '../deliveries/delivery.entity';

@Entity('leases')
export class Lease extends Receipt {
  @Column({ name: 'cell_id' })
  cellId: number;

  @ManyToOne(() => Cell, { nullable: false })
  @JoinColumn({ name: 'cell_id' })
  cell: Cell;

  @Column({ type: 'enum', enum: Kind, default: Kind.PRODUCT })
  kind: Kind;

  @OneToMany(() => Product, (product) => product.lease)
  products: Product[];

  @OneToMany(() => Lot, (lot) => lot.lease)
  lots: Lot[];

  @OneToMany(() => Order, (order) => order.lease)
  orders: Order[];

  @OneToMany(() => Delivery, (delivery) => delivery.fromLease)
  fromDeliveries: Delivery[];

  @OneToMany(() => Delivery, (delivery) => delivery.toLease)
  toDeliveries: Delivery[];
}
