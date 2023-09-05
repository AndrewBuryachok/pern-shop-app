import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Thing } from '../things/thing.entity';
import { Lease } from '../leases/lease.entity';
import { Bid } from '../bids/bid.entity';

@Entity('lots')
export class Lot extends Thing {
  @Column({ name: 'lease_id' })
  leaseId: number;

  @OneToOne(() => Lease, { nullable: false })
  @JoinColumn({ name: 'lease_id' })
  lease: Lease;

  @Column({ type: 'timestamptz', name: 'completed_at', nullable: true })
  completedAt?: Date;

  @OneToMany(() => Bid, (bid) => bid.lot)
  bids: Bid[];
}
