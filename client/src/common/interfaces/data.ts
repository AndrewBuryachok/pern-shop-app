import { IResponse } from './response';

export interface IData<T> {
  data?: IResponse<T>;
  isFetching: boolean;
  isLoading: boolean;
}
