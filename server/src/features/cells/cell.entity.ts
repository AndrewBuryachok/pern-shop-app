import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Container } from '../containers/container.entity';
import { Storage } from '../storages/storage.entity';
import { StorageTag } from '../storages-tags/storage-tag.entity';

@Entity('cells')
export class Cell extends Container {
  @Column({ name: 'storage_id' })
  storageId: number;

  @ManyToOne(() => Storage, { nullable: false })
  @JoinColumn({ name: 'storage_id' })
  storage: Storage;

  @Column({ name: 'storage_tag_id' })
  storageTagId: number;

  @ManyToOne(() => StorageTag, { nullable: false })
  @JoinColumn({ name: 'storage_tag_id' })
  storageTag: StorageTag;
}
