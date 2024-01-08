import { LgThing, MdThing, SmThing } from '../things/thing.model';
import { SmLease } from '../leases/lease.model';

export interface SmLot extends SmThing {}

export interface MdLot extends MdThing {
  lease: SmLease;
  amount: number;
}

export interface Lot extends LgThing {
  lease: SmLease;
  bids: number;
}
