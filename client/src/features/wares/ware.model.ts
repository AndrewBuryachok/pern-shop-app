import { LgThing, SmThing, SmThingWithoutPrice } from '../things/thing.model';
import { MdRent, SmRent } from '../rents/rent.model';

export interface SmWareWithoutPrice extends SmThingWithoutPrice {
  rent: SmRent;
}

export interface SmWare extends SmThing {}

export interface MdWare extends SmThing {
  rent: MdRent;
}

export interface Ware extends LgThing {
  rent: MdRent;
  states: number;
}
