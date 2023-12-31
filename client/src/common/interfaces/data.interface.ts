import { IResponse } from './response.interface';

export interface IData<T> {
  data?: IResponse<T>;
  isLoading: boolean;
}
