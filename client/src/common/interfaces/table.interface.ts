import { INav } from './nav.interface';
import { IHead } from './head.interface';
import { IData } from './data.interface';
import { IPagination } from './pagination.interface';
import { IAction } from './action.interface';

export type ITable<T> = INav & IHead & IData<T> & IPagination;

export interface ITableWithActions<T> extends ITable<T> {
  actions?: IAction<T>[];
}
