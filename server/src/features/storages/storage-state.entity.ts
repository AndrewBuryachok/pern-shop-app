import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { State } from '../states/state.entity';
import { Storage } from './storage.entity';

@Entity('storages_states')
export class StorageState extends State {
  @Column({ name: 'storage_id' })
  storageId: number;

  @ManyToOne(() => Storage, { nullable: false })
  @JoinColumn({ name: 'storage_id' })
  storage: Storage;
}
