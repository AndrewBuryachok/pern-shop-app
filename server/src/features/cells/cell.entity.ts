import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Container } from '../containers/container.entity';
import { Storage } from '../storages/storage.entity';

@Entity('cells')
export class Cell extends Container {
  @Column({ name: 'storage_id' })
  storageId: number;

  @ManyToOne(() => Storage, { nullable: false })
  @JoinColumn({ name: 'storage_id' })
  storage: Storage;
}
