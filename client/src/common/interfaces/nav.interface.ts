import { Role } from '../constants';

export interface INav {
  button?: {
    label: string;
    icon?: React.ReactNode;
    roles?: Role[];
    open: () => void;
  };
}
