import { Entity, OneToMany } from 'typeorm';
import { PlaceWithCard } from '../places/place.entity';
import { Cell } from '../cells/cell.entity';
import { StorageTag } from '../storages-tags/storage-tag.entity';

@Entity('storages')
export class Storage extends PlaceWithCard {
  @OneToMany(() => Cell, (cell) => cell.storage)
  cells: Cell[];

  @OneToMany(() => StorageTag, (tag) => tag.storage)
  tags: StorageTag[];
}
