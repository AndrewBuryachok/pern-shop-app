import { IRequest } from '../interfaces';
import { ROWS_PER_PAGE } from '../constants';

export const getQuery = ({ page, search }: IRequest) => {
  const query = new URLSearchParams();
  if (page) {
    query.append('skip', `${(page - 1) * ROWS_PER_PAGE}`);
    query.append('take', `${ROWS_PER_PAGE}`);
  }
  if (search?.user) {
    query.append('user', search.user);
  }
  if (search?.card) {
    query.append('card', search.card);
  }
  if (search?.roles?.length) {
    query.append('roles', search.roles.join());
  }
  const filters = search?.filters?.filter((filter) => filter.value);
  if (filters?.length) {
    query.append(
      'filters',
      filters.map((filter) => filter.label.toLowerCase()).join(),
    );
  }
  if (search?.mode) {
    query.append('mode', search.mode.toLowerCase());
  }
  if (search?.city) {
    query.append('city', search.city);
  }
  if (search?.shop) {
    query.append('shop', search.shop);
  }
  if (search?.market) {
    query.append('market', search.market);
  }
  if (search?.storage) {
    query.append('storage', search.storage);
  }
  if (search?.store) {
    query.append('store', search.store);
  }
  if (search?.cell) {
    query.append('cell', search.cell);
  }
  if (search?.item) {
    query.append('item', search.item);
  }
  if (search?.description) {
    query.append('description', search.description);
  }
  if (search?.type) {
    query.append('type', search.type);
  }
  if (search?.status) {
    query.append('status', `${search.status}`);
  }
  if (search?.rate) {
    query.append('rate', `${search.rate}`);
  }
  if (search?.name) {
    query.append('name', search.name);
  }
  return query.toString();
};
