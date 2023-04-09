import { Transportation } from '../transportations/transportation.model';
import { LgCell } from '../cells/cell.model';
import { MdCard } from '../cards/card.model';
import { SmUser } from '../users/user.model';

export interface Delivery extends Transportation {
  fromCell: LgCell;
  toCell: LgCell;
  senderCard: MdCard;
  receiverUser: SmUser;
}
