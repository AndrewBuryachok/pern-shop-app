import { ThingWithAmount } from '../things/thing.entity';
import { Cell } from '../cells/cell.entity';
import { Card } from '../cards/card.entity';

export class Product extends ThingWithAmount {
  cellId: number;
  cell: Cell;
  cardId: number;
  card: Card;
}
