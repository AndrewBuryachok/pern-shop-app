import { Role } from '../users/role.enum';

export interface JwtPayload {
  sub: number;
}

export interface ExtJwtPayload extends JwtPayload {
  nick: string;
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
