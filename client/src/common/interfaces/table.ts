import { INav } from './nav';
import { IHead } from './head';
import { IData } from './data';
import { IPagination } from './pagination';
import { IAction } from './action';

export type ITable<T> = INav & IHead & IData<T> & IPagination;

export interface ITableWithActions<T> extends ITable<T> {
  actions?: IAction<T>[];
}
