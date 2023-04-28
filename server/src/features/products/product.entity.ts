import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Thing } from '../things/thing.entity';
import { Lease } from '../leases/lease.entity';

@Entity('products')
export class Product extends Thing {
  @Column({ name: 'lease_id' })
  leaseId: number;

  @OneToOne(() => Lease, { nullable: false })
  @JoinColumn({ name: 'lease_id' })
  lease: Lease;
}
