import { getCurrentUser } from '../../features/auth/auth.slice';
import { Role } from '../constants';

export * from './query.util';
export * from './parse.util';
export * from './view.util';
export * from './select.util';
export * from './scale.util';

export const customMin = (required: number, optional?: number) =>
  optional === undefined ? required : Math.min(required, optional);

export const isUserHasRole = (role?: Role) => {
  const user = getCurrentUser();
  return (
    user &&
    (!role || [Role.ADMIN, role].some((role) => user.roles.includes(role)))
  );
};

export const isUserNotHasRole = (role?: Role) => !isUserHasRole(role);
