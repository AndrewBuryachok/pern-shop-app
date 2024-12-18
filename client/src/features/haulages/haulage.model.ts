import { Transportation } from '../transportations/transportation.model';
import { SmHire } from '../hires/hire.model';

export interface Haulage extends Transportation {
  fromHire: SmHire;
  toHire: SmHire;
}
