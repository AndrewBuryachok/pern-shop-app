import { Entity } from 'typeorm';
import { PlaceWithCard } from '../places/place.entity';

@Entity('markets')
export class Market extends PlaceWithCard {}
