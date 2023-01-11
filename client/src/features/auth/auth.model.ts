import { MdUser } from '../users/user.model';

export interface Tokens extends MdUser {
  access: string;
  refresh: string;
}
