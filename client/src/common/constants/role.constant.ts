import { colors } from './color.constant';

export enum Role {
  ADMIN = 1,
  BANKER = 2,
  MANAGER = 3,
  JUDGE = 4,
  HUB = 5,
  SPAWN = 6,
  END = 7,
  PRESIDENT = 8,
  FBI = 9,
}

export const roles = [
  'admin',
  'banker',
  'manager',
  'judge',
  'hub',
  'spawn',
  'end',
  'president',
  'fbi',
];

export const rolesToColors = colors.concat([
  'pink',
  'teal',
  'violet',
  'orange',
  'cyan',
]);
