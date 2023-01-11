import { ReactNode } from 'react';
import { ITable } from './table';

export interface IPage<T> extends ITable<T> {
  children: ReactNode;
  minWidth: number;
  columns: string[];
}
