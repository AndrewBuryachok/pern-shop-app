import { Color } from '../constants';

export interface IAction<T> {
  open: (data: T) => void;
  disable: (data: T) => boolean;
  color: Color;
}
