import { Mode } from '../enums';

export interface ISearch {
  page: number;
  id?: number | null;
  user?: string | null;
  card?: string | null;
  modes?: Mode[];
  mode?: Mode | null;
  roles?: string[];
  town?: string | null;
  shop?: string | null;
  station?: string | null;
  item?: string | null;
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
  status?: string | null;
  minDate?: string | null;
  maxDate?: string | null;
  completed?: string | null;
  rate?: number | null;
}
