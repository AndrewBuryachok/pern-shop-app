import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Receipt } from '../receipts/receipt.entity';
import { Box } from '../boxes/box.entity';
import { Order } from '../orders/order.entity';
import { Haulage } from '../haulages/haulage.entity';
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

  @OneToMany(() => Haulage, (haulage) => haulage.fromHire)
  fromHaulages: Haulage[];

  @OneToMany(() => Haulage, (haulage) => haulage.toHire)
  toHaulages: Haulage[];

  @OneToMany(() => Delivery, (delivery) => delivery.hire)
  deliveries: Delivery[];
}
