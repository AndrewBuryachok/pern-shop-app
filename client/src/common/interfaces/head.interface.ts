import { ISearch } from './search.interface';

export interface IHead {
  search: ISearch;
  isFetching: boolean;
  refetch: () => void;
}
