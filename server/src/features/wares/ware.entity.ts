import { ThingWithAmount } from '../things/thing.entity';
import { Rent } from '../rents/rent.entity';

export class Ware extends ThingWithAmount {
  rentId: number;
  rent: Rent;
}
