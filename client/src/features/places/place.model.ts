import { SmUser } from '../users/user.model';
import { MdCard } from '../cards/card.model';

export interface SmPlace {
  id: number;
  name: string;
  x: number;
  y: number;
}

export interface SmPlaceWithUser extends SmPlace {
  user: SmUser;
}

export interface SmPlaceWithCard extends SmPlace {
  card: MdCard;
}

export interface SmPlaceWithPrice extends SmPlaceWithCard {
  price: number;
}

export interface Place extends SmPlace {
  description: string;
  createdAt: Date;
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

export enum PlaceType {
  TOWNS = 'towns',
  SHOPS = 'shops',
  MARKETS = 'markets',
  STORAGES = 'storages',
  STATIONS = 'stations',
}

export interface ExtPlace extends PlaceWithUser {
  type: PlaceType;
  card?: MdCard;
  price?: number;
}
