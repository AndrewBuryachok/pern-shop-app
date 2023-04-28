import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Transportation } from '../transportations/transportation.entity';
import { Lease } from '../leases/lease.entity';

@Entity('orders')
export class Order extends Transportation {
  @Column({ name: 'lease_id' })
  leaseId: number;

  @OneToOne(() => Lease, { nullable: false })
  @JoinColumn({ name: 'lease_id' })
  lease: Lease;
}
