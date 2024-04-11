import { Container } from '../containers/container.model';
import { MdStorage, SmStorage } from '../storages/storage.model';
import { SmStorageTag } from '../storages-tags/storage-tag.model';

export interface SmCell extends Container {}

export interface MdCell extends SmCell {
  storage: SmStorage;
}

export interface LgCell extends SmCell {
  storage: MdStorage;
  storageTag: SmStorageTag;
}

export interface Cell extends LgCell {
  reservedUntil?: Date;
}
