import { Entity } from 'typeorm';
import { PlaceWithUser } from '../places/place.entity';

@Entity('shops')
export class Shop extends PlaceWithUser {}
