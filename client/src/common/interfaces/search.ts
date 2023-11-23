import { Mode } from '../enums';

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
  item?: string | null;
  description?: string;
  type?: string | null;
  kind?: string | null;
  status?: string | null;
  priority?: string | null;
  rate?: number | null;
}
