import { ISearch } from './search';

export interface IHead {
  title: string;
  search: ISearch;
  setSearch: (search: ISearch) => void;
  isFetching: boolean;
  refetch: () => void;
}
