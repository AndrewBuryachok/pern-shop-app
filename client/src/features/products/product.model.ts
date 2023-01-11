import { Thing, ThingWithAmount, ThingWithKit } from '../things/thing.model';
import { MdCell } from '../cells/cell.model';
import { MdCard } from '../cards/card.model';

export interface SmProduct extends Thing {}

export interface MdProduct extends ThingWithKit {
  cell: MdCell;
  card: MdCard;
}

export interface Product extends ThingWithAmount {
  cell: MdCell;
  card: MdCard;
}
