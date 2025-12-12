import { Entity } from 'typeorm';
import { PlaceWithUser } from '../places/place.entity';

@Entity('stations')
export class Station extends PlaceWithUser {}
