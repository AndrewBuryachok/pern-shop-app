import { AfterLoad, Entity, OneToMany } from 'typeorm';
import { PlaceWithCard } from '../places/place.entity';
import { Cell } from '../cells/cell.entity';
import { StorageState } from './storage-state.entity';

@Entity('storages')
export class Storage extends PlaceWithCard {
  @OneToMany(() => Cell, (cell) => cell.storage)
  cells: Cell[];

  @OneToMany(() => StorageState, (state) => state.storage)
  states: StorageState[];

  @AfterLoad()
  setPrice() {
    if (!this.price && this.states) {
      this.price = this.states[0].price;
      delete this.states;
    }
  }
}
