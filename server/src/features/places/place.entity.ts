import { User } from '../users/user.entity';
import { Card } from '../cards/card.entity';

export abstract class Place {
  id: number;
  name: string;
  x: number;
  y: number;
}

export abstract class PlaceWithUser extends Place {
  userId: number;
  user: User;
}

export abstract class PlaceWithCard extends Place {
  cardId: number;
  card: Card;
  price: number;
}
