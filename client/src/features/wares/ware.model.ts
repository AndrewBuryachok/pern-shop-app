import { LgThing, SmThing } from '../things/thing.model';
import { SmRent } from '../rents/rent.model';

export interface SmWare extends SmThing {
  rent: SmRent;
}

export interface Ware extends LgThing {
  rent: SmRent;
  states: number;
}
