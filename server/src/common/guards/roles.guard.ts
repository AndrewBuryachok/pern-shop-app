import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExtJwtPayload } from '../../features/auth/auth.interface';
import { Role } from '../../features/users/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user as ExtJwtPayload;
    const roles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    return (
      !roles || [Role.ADMIN, ...roles].some((role) => user.roles.includes(role))
    );
  }
}
