import { ReactNode } from 'react';
import { ITable } from './table';

export interface IPage<T> extends ITable<T> {
  children: ReactNode;
}

export interface IPageWithColumns<T> extends IPage<T> {
  minWidth: number;
  columns: string[];
}
