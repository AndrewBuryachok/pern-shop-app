import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Transportation } from '../transportations/transportation.entity';
import { Hire } from '../hires/hire.entity';
import { Purchase } from '../purchases/purchase.entity';

@Entity('deliveries')
export class Delivery extends Transportation {
  @Column({ name: 'hire_id' })
  hireId: number;

  @ManyToOne(() => Hire, { nullable: false })
  @JoinColumn({ name: 'hire_id' })
  hire: Hire;

  @Column({ name: 'purchase_id' })
  purchaseId: number;

  @OneToOne(() => Purchase, { nullable: false })
  @JoinColumn({ name: 'purchase_id' })
  purchase: Purchase;
}
