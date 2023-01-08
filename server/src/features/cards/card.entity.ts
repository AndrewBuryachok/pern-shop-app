import { User } from '../users/user.entity';

export class Card {
  id: number;
  userId: number;
  user: User;
  name: string;
  color: number;
  balance: number;
}
