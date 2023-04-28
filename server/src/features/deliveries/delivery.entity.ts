import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Transportation } from '../transportations/transportation.entity';
import { Lease } from '../leases/lease.entity';
import { User } from '../users/user.entity';

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

  @Column({ name: 'receiver_user_id' })
  receiverUserId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'receiver_user_id' })
  receiverUser: User;
}
