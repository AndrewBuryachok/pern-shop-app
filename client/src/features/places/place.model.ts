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
}

export interface PlaceWithPrice extends PlaceWithCard {
  price: number;
}

export interface ExtPlace extends Place {
  type: number;
  owner: SmUser;
  card?: MdCard;
  image: string;
  video: string;
  description: string;
  price?: number;
  createdAt: Date;
}
