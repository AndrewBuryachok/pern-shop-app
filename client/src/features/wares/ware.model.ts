import { LgThing, MdThing, SmThing } from '../things/thing.model';
import { SmRent } from '../rents/rent.model';
import { State } from '../states/state.model';

export interface SmWare extends SmThing {}

export interface MdWare extends MdThing {
  rent: SmRent;
}

export interface Ware extends LgThing {
  rent: SmRent;
  states: State[];
}
