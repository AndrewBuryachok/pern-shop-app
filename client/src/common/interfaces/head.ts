export interface ISearch {
  user?: string;
  filters?: { label: string; value: boolean }[];
  name?: string;
  item?: string;
  description?: string;
  type?: string;
}

export interface IHead {
  title: string;
  search: ISearch;
  setSearch: (search: ISearch) => void;
  isFetching: boolean;
}
