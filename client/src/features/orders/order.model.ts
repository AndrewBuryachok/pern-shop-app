import { Transportation } from '../transportations/transportation.model';
import { LgCell } from '../cells/cell.model';
import { MdCard } from '../cards/card.model';

export interface Order extends Transportation {
  cell: LgCell;
  customerCard: MdCard;
}
