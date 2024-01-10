import { LgThing, MdThing } from '../things/thing.model';
import { SmLease } from '../leases/lease.model';

export interface SmLot extends MdThing {
  lease: SmLease;
}

export interface Lot extends LgThing {
  lease: SmLease;
  bids: number;
}
