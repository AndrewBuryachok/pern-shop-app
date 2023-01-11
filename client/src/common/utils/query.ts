import { IRequest } from '../interfaces';
import { ROWS_PER_PAGE } from '../constants';

export const getQuery = ({ page, search }: IRequest) =>
  `${page ? `skip=${(page - 1) * ROWS_PER_PAGE}&take=${ROWS_PER_PAGE}` : ''}${
    search ? `&search=${search}` : ''
  }`;
