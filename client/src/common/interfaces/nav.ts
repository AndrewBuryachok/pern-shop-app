import { Role } from '../constants';

export interface INav {
  links: { label: string; to: string; role?: Role }[];
  button?: { label: string; open: () => void };
}
