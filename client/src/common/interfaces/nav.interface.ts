import { Role } from '../constants';

export interface INav {
  button?: { label: string; open: () => void; role?: Role };
}
