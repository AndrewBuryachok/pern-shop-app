import { Role } from '../users/role.enum';

export interface JwtPayload {
  sub: number;
  name: string;
}

export interface ExtJwtPayload extends JwtPayload {
  roles: Role[];
}

export interface Tokens {
  id: number;
  name: string;
  roles: Role[];
  access: string;
  refresh: string;
}
