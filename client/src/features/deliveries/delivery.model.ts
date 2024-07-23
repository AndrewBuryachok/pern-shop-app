import { Transportation } from '../transportations/transportation.model';
import { SmHire } from '../hires/hire.model';

export interface Delivery extends Transportation {
  fromHire: SmHire;
  toHire: SmHire;
}
