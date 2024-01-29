import { LgThing } from '../things/thing.model';
import { SmUser } from '../users/user.model';

export interface Task extends LgThing {
  customerUser: SmUser;
  executorUser?: SmUser;
  status: number;
}
