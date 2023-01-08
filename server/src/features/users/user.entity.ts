import { Role } from './role.enum';
import { City } from '../cities/city.entity';

export class User {
  id: number;
  name: string;
  password: string;
  token?: string;
  roles: Role[];
  cityId?: number;
  city: City;
}
