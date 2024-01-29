import { colors } from './color.constant';

export enum Role {
  ADMIN = 1,
  BANKER = 2,
  MANAGER = 3,
  JUDGE = 4,
  HUB = 5,
  SPAWN = 6,
}

export const roles = ['admin', 'banker', 'manager', 'judge', 'hub', 'spawn'];

export const rolesToColors = colors.concat(['pink', 'teal']);
