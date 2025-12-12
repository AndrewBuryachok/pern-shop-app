import {
  SmTransportation,
  Transportation,
} from '../transportations/transportation.model';
import { SmPurchaseWithoutPrice } from '../purchases/purchase.model';

export interface SmDelivery extends SmTransportation {}

export interface Delivery extends Transportation {
  purchase: SmPurchaseWithoutPrice;
}
