export interface ISearch {
  user?: string;
  card?: string;
  mode?: string;
  filters?: { label: string; value: boolean }[];
  city?: string;
  shop?: string;
  market?: string;
  storage?: string;
  store?: string;
  cell?: string;
  name?: string;
  users?: boolean;
  cards?: boolean;
  item?: string;
  description?: string;
  type?: string;
}
