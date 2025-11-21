import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Receipt } from '../receipts/receipt.entity';
import { Box } from '../boxes/box.entity';
import { Order } from '../orders/order.entity';
import { Delivery } from '../deliveries/delivery.entity';

@Entity('hires')
export class Hire extends Receipt {
  @Column({ name: 'box_id' })
  boxId: number;

  @ManyToOne(() => Box, { nullable: false })
  @JoinColumn({ name: 'box_id' })
  box: Box;

  @OneToMany(() => Order, (order) => order.hire)
  orders: Order[];

  @OneToMany(() => Delivery, (delivery) => delivery.hire)
  deliveries: Delivery[];
}
