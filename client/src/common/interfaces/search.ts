import { Mode } from '../enums';
import { Priority, Status } from '../constants';

export interface ISearch {
  user?: string | null;
  card?: string | null;
  modes?: Mode[];
  mode?: Mode | null;
  roles?: string[];
  city?: string | null;
  shop?: string | null;
  market?: string | null;
  storage?: string | null;
  store?: string | null;
  cell?: string | null;
  users?: boolean;
  cards?: boolean;
  item?: string | null;
  description?: string;
  type?: string | null;
  priority?: Priority | null;
  status?: Status | null;
  rate?: number | null;
  name?: string;
}
