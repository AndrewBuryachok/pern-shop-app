import { Thing, ThingWithAmount, ThingWithKit } from '../things/thing.model';
import { SmRent } from '../rents/rent.model';

export interface SmWare extends Thing {}

export interface MdWare extends ThingWithKit {
  rent: SmRent;
}

export interface Ware extends ThingWithAmount {
  rent: SmRent;
}
