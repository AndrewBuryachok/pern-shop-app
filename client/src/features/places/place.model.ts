import { SmUser } from '../users/user.model';
import { MdCard } from '../cards/card.model';

export interface Place {
  id: number;
  name: string;
  x: number;
  y: number;
}

export interface PlaceWithUser extends Place {
  user: SmUser;
}

export interface PlaceWithCard extends Place {
  card: MdCard;
  price: number;
}

export interface ExtPlace extends Place {
  type: number;
  owner: string;
  price?: number;
  data: (string | { value: string; label: string })[];
}
