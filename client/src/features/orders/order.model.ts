import { Transportation } from '../transportations/transportation.model';
import { SmLease } from '../leases/lease.model';

export interface Order extends Transportation {
  lease: SmLease;
}
