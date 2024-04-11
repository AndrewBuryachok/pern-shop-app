import { SmTag, Tag } from '../tags/tag.model';
import { MdStorage, SmStorage } from '../storages/storage.model';

export interface SmStorageTag extends SmTag {}

export interface MdStorageTag extends SmStorageTag {
  storage: SmStorage;
}

export interface StorageTag extends Tag {
  storage: MdStorage;
  cells: number;
}
