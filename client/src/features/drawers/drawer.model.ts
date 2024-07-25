import { Container } from '../containers/container.model';
import {
  MdStation,
  MdStationWithPrice,
  SmStation,
} from '../stations/station.model';

export interface SmDrawer extends Container {}

export interface MdDrawer extends SmDrawer {
  station: SmStation;
}

export interface LgDrawer extends SmDrawer {
  station: MdStation;
}

export interface LgDrawerWithPrice extends SmDrawer {
  station: MdStationWithPrice;
}

export interface Drawer extends LgDrawerWithPrice {
  reservedUntil?: Date;
}
