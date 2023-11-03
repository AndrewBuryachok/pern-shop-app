import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Transportation } from '../transportations/transportation.entity';
import { Lease } from '../leases/lease.entity';

@Entity('deliveries')
export class Delivery extends Transportation {
  @Column({ name: 'from_lease_id' })
  fromLeaseId: number;

  @OneToOne(() => Lease, { nullable: false })
  @JoinColumn({ name: 'from_lease_id' })
  fromLease: Lease;

  @Column({ name: 'to_lease_id' })
  toLeaseId: number;

  @OneToOne(() => Lease, { nullable: false })
  @JoinColumn({ name: 'to_lease_id' })
  toLease: Lease;
}
