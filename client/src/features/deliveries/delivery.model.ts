import { Transportation } from '../transportations/transportation.model';
import { SmLease } from '../leases/lease.model';
import { SmUser } from '../users/user.model';

export interface Delivery extends Transportation {
  fromLease: SmLease;
  toLease: SmLease;
  receiverUser: SmUser;
}
