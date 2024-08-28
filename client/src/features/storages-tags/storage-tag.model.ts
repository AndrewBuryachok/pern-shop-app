import { SmTag, Tag } from '../tags/tag.model';
import { MdStorage } from '../storages/storage.model';

export interface SmStorageTag extends SmTag {}

export interface StorageTag extends Tag {
  storage: MdStorage;
  cells: number;
}
