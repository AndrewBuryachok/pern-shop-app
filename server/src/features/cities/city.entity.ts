import { Entity } from 'typeorm';
import { PlaceWithUser } from '../places/place.entity';

@Entity('cities')
export class City extends PlaceWithUser {}
