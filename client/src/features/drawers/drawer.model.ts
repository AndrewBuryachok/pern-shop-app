import { Container } from '../containers/container.model';
import { MdStation, SmStation } from '../stations/station.model';

export interface SmDrawer extends Container {}

export interface MdDrawer extends SmDrawer {
  station: SmStation;
}

export interface LgDrawer extends SmDrawer {
  station: MdStation;
}

export interface Drawer extends LgDrawer {
  reservedUntil?: Date;
}
