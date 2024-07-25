import { Container } from '../containers/container.model';
import { MdStorage, SmStorage } from '../storages/storage.model';
import { SmStorageTag } from '../storages-tags/storage-tag.model';

export interface SmCell extends Container {}

export interface MdCell extends SmCell {
  storage: SmStorage;
}

export interface LgCell extends SmCell {
  storage: MdStorage;
}

export interface LgCellWithTag extends LgCell {
  storageTag: SmStorageTag;
}

export interface Cell extends LgCellWithTag {
  reservedUntil?: Date;
}
