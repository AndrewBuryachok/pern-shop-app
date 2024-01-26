import { Mode } from '../enums';

export interface ISearch {
  id?: number | null;
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
  title?: string;
  description?: string;
  type?: string | null;
  minSum?: number | null;
  maxSum?: number | null;
  minAmount?: number | null;
  maxAmount?: number | null;
  minIntake?: number | null;
  maxIntake?: number | null;
  kit?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  kind?: string | null;
  priority?: string | null;
  status?: string | null;
  mark?: string | null;
  result?: string | null;
  rate?: number | null;
  minDate?: string | null;
  maxDate?: string | null;
}
