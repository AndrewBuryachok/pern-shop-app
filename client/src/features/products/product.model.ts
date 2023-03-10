import { LgThing, MdThing, SmThing } from '../things/thing.model';
import { MdCell } from '../cells/cell.model';
import { MdCard } from '../cards/card.model';

export interface SmProduct extends SmThing {}

export interface MdProduct extends MdThing {
  cell: MdCell;
  card: MdCard;
}

export interface Product extends LgThing {
  cell: MdCell;
  card: MdCard;
}
