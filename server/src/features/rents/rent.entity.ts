import { Store } from '../stores/store.entity';
import { Card } from '../cards/card.entity';

export class Rent {
  id: number;
  storeId: number;
  store: Store;
  cardId: number;
  card: Card;
  createdAt: Date;
}
