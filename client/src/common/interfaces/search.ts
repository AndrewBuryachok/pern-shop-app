export interface ISearch {
  user?: string | null;
  card?: string | null;
  mode?: string;
  filters?: { label: string; value: boolean }[];
  city?: string | null;
  shop?: string | null;
  market?: string | null;
  storage?: string | null;
  store?: string | null;
  cell?: string | null;
  name?: string;
  users?: boolean;
  cards?: boolean;
  item?: string | null;
  description?: string;
  type?: string | null;
}
