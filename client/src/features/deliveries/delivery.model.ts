import { Transportation } from '../transportations/transportation.model';
import { SmLease } from '../leases/lease.model';

export interface Delivery extends Transportation {
  fromLease: SmLease;
  toLease: SmLease;
}
