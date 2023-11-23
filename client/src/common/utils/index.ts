import { getCurrentUser } from '../../features/auth/auth.slice';
import { Role } from '../constants';

export * from './query';
export * from './parse';
export * from './view';
export * from './select';
export * from './scale';

export const customMin = (required: number, optional?: number) =>
  optional === undefined ? required : Math.min(required, optional);

export const isUserHasRole = (role?: Role) => {
  const user = getCurrentUser();
  return user && (!role || user.roles.includes(role));
};

export const isUserNotHasRole = (role?: Role) => !isUserHasRole(role);
