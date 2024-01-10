import { LgThing, SmThing } from '../things/thing.model';
import { SmLease } from '../leases/lease.model';

export interface SmProduct extends SmThing {
  lease: SmLease;
}

export interface Product extends LgThing {
  lease: SmLease;
  states: number;
}
