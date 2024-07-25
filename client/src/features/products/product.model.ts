import { LgThing, SmThing, SmThingWithoutPrice } from '../things/thing.model';
import { MdLease, SmLease } from '../leases/lease.model';

export interface SmProductWithoutPrice extends SmThingWithoutPrice {
  lease: SmLease;
}

export interface SmProduct extends SmThing {}

export interface MdProduct extends SmThing {
  lease: MdLease;
}

export interface Product extends LgThing {
  lease: MdLease;
  states: number;
}
