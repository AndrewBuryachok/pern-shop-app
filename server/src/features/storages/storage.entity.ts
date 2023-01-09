import { Entity, OneToMany } from 'typeorm';
import { PlaceWithCard } from '../places/place.entity';
import { Cell } from '../cells/cell.entity';

@Entity('storages')
export class Storage extends PlaceWithCard {
  @OneToMany(() => Cell, (cell) => cell.storage)
  cells: Cell[];
}
