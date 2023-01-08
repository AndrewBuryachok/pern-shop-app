import { Entity } from 'typeorm';
import { PlaceWithCard } from '../places/place.entity';

@Entity('storages')
export class Storage extends PlaceWithCard {}
