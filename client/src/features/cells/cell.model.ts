import { Container } from '../containers/container.model';
import { MdStorage, SmStorage } from '../storages/storage.model';

export interface SmCell extends Container {}

export interface MdCell extends SmCell {
  storage: SmStorage;
}

export interface LgCell extends SmCell {
  storage: MdStorage;
}

export interface Cell extends LgCell {
  reservedAt?: Date;
}
