import { ISearch } from './search.interface';

export interface IRequest {
  page?: number;
  search?: ISearch;
}
