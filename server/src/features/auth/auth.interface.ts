import { Role } from '../users/role.enum';

export interface JwtPayload {
  sub: number;
  nick: string;
}

export interface ExtJwtPayload extends JwtPayload {
  roles: Role[];
}

export interface Tokens {
  id: number;
  nick: string;
  avatar: string;
  roles: Role[];
  access: string;
  refresh: string;
}
