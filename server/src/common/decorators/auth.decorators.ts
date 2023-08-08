import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { ExtJwtPayload, JwtPayload } from '../../features/auth/auth.interface';
import { Role } from '../../features/users/role.enum';

export const Public = () => SetMetadata('isPublic', true);

export const MyId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.sub;
  },
);

export const HasRole = createParamDecorator(
  (role: Role, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as ExtJwtPayload;
    return user.roles.includes(role);
  },
);

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
