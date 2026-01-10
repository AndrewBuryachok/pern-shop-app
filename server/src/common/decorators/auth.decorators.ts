import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { ExtJwtPayload } from '../../features/auth/auth.interface';
import { Role } from '../../features/users/role.enum';

export const Public = () => SetMetadata('isPublic', true);

export const MyId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as ExtJwtPayload;
    return user.sub;
  },
);

export const HasRole = (...roles: Role[]) =>
  createParamDecorator((roles: Role[], context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as ExtJwtPayload;
    return [...roles, Role.ADMIN].some((role) => user.roles.includes(role));
  })(roles);

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
