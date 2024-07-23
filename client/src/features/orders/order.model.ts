import { Transportation } from '../transportations/transportation.model';
import { SmHire } from '../hires/hire.model';

export interface Order extends Transportation {
  hire: SmHire;
}
