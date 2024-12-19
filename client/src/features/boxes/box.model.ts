import { Container } from '../containers/container.model';
import {
  MdStation,
  MdStationWithPrice,
  SmStation,
} from '../stations/station.model';

export interface SmBox extends Container {}

export interface MdBox extends SmBox {
  station: SmStation;
}

export interface LgBox extends SmBox {
  station: MdStation;
}

export interface Box extends SmBox {
  station: MdStationWithPrice;
  reservedUntil?: Date;
}
