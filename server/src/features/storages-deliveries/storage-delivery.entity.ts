import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Delivery } from '../deliveries/delivery.entity';
import { Hire } from '../hires/hire.entity';
import { Sale } from '../sales/sale.entity';

@Entity('storages_deliveries')
export class StorageDelivery extends Delivery {
  @Column({ name: 'hire_id' })
  hireId: number;

  @ManyToOne(() => Hire, { nullable: false })
  @JoinColumn({ name: 'hire_id' })
  hire: Hire;

  @Column({ name: 'sale_id' })
  saleId: number;

  @OneToOne(() => Sale, { nullable: false })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;
}
