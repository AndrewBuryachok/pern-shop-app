import { LgThing, MdThing, SmThing } from '../things/thing.model';
import { LgCell } from '../cells/cell.model';
import { MdCard } from '../cards/card.model';

export interface SmProduct extends SmThing {}

export interface MdProduct extends MdThing {
  cell: LgCell;
  card: MdCard;
}

export interface Product extends LgThing {
  cell: LgCell;
  card: MdCard;
}
