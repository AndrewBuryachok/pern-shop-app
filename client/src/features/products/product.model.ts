import { LgThing, MdThing, SmThing } from '../things/thing.model';
import { SmLease } from '../leases/lease.model';

export interface SmProduct extends SmThing {}

export interface MdProduct extends MdThing {
  lease: SmLease;
}

export interface Product extends LgThing {
  lease: SmLease;
  states: number;
}
