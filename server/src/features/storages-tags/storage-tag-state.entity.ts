import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { State } from '../states/state.entity';
import { StorageTag } from './storage-tag.entity';

@Entity('storages_tags_states')
export class StorageTagState extends State {
  @Column({ name: 'storage_tag_id' })
  storageTagId: number;

  @ManyToOne(() => StorageTag, { nullable: false })
  @JoinColumn({ name: 'storage_tag_id' })
  storageTag: StorageTag;
}
