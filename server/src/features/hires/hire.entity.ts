import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Receipt } from '../receipts/receipt.entity';
import { Drawer } from '../drawers/drawer.entity';
import { Order } from '../orders/order.entity';
import { Delivery } from '../deliveries/delivery.entity';

@Entity('hires')
export class Hire extends Receipt {
  @Column({ name: 'drawer_id' })
  drawerId: number;

  @ManyToOne(() => Drawer, { nullable: false })
  @JoinColumn({ name: 'drawer_id' })
  drawer: Drawer;

  @OneToMany(() => Order, (order) => order.hire)
  orders: Order[];

  @OneToMany(() => Delivery, (delivery) => delivery.fromHire)
  fromDeliveries: Delivery[];

  @OneToMany(() => Delivery, (delivery) => delivery.toHire)
  toDeliveries: Delivery[];
}
