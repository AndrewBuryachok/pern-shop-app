import { ISearch } from './search.interface';

export interface IHead {
  search: ISearch;
  setSearch: (search: ISearch) => void;
  isFetching: boolean;
  refetch: () => void;
}
