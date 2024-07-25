import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Receipt } from '../receipts/receipt.entity';
import { Drawer } from '../drawers/drawer.entity';
import { Order } from '../orders/order.entity';
import { Delivery } from '../deliveries/delivery.entity';
import { MarketDelivery } from '../markets-deliveries/market-delivery.entity';
import { StorageDelivery } from '../storages-deliveries/storage-delivery.entity';

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

  @OneToMany(() => MarketDelivery, (marketDelivery) => marketDelivery.hire)
  marketsDeliveries: MarketDelivery[];

  @OneToMany(() => StorageDelivery, (storageDelivery) => storageDelivery.hire)
  storagesDeliveries: StorageDelivery[];
}
