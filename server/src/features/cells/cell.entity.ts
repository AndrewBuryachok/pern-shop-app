import { Container } from '../containers/container.entity';
import { Storage } from '../storages/storage.entity';

export class Cell extends Container {
  storageId: number;
  storage: Storage;
}
