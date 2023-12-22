import { ISearch } from './search';

export interface IHead {
  search: ISearch;
  setSearch: (search: ISearch) => void;
  isFetching: boolean;
  refetch: () => void;
}
