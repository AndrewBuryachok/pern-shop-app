import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Tag } from '../tags/tag.entity';
import { Storage } from '../storages/storage.entity';
import { Cell } from '../cells/cell.entity';
import { StorageTagState } from './storage-tag-state.entity';

@Entity('storages_tags')
export class StorageTag extends Tag {
  @Column({ name: 'storage_id' })
  storageId: number;

  @ManyToOne(() => Storage, { nullable: false })
  @JoinColumn({ name: 'storage_id' })
  storage: Storage;

  @OneToMany(() => Cell, (cell) => cell.storageTag)
  cells: Cell[];

  @OneToMany(() => StorageTagState, (state) => state.storageTag)
  states: StorageTagState[];

  @AfterLoad()
  setPrice() {
    if (!this.price && this.states) {
      this.price = this.states[0].price;
      delete this.states;
    }
  }
}
