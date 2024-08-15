import { Place, PlaceWithUser } from '../places/place.model';

export interface SmFarm extends Place {}

export interface MdFarm extends PlaceWithUser {}

export interface Farm extends MdFarm {
  image: string;
  video: string;
  description: string;
  createdAt: Date;
  users: number;
  goods: number;
}
