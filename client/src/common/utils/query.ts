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
  if (search?.mode) {
    query.append('mode', search.mode);
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
  if (search?.minSum) {
    query.append('minSum', `${search.minSum}`);
  }
  if (search?.maxSum) {
    query.append('maxSum', `${search.maxSum}`);
  }
  if (search?.minAmount) {
    query.append('minAmount', `${search.minAmount}`);
  }
  if (search?.maxAmount) {
    query.append('maxAmount', `${search.maxAmount}`);
  }
  if (search?.minIntake) {
    query.append('minIntake', `${search.minIntake}`);
  }
  if (search?.maxIntake) {
    query.append('maxIntake', `${search.maxIntake}`);
  }
  if (search?.kit) {
    query.append('kit', search.kit);
  }
  if (search?.minPrice) {
    query.append('minPrice', `${search.minPrice}`);
  }
  if (search?.maxPrice) {
    query.append('maxPrice', `${search.maxPrice}`);
  }
  if (search?.kind) {
    query.append('kind', search.kind);
  }
  if (search?.status) {
    query.append('status', search.status);
  }
  if (search?.priority) {
    query.append('priority', search.priority);
  }
  if (search?.rate) {
    query.append('rate', `${search.rate}`);
  }
  return query.toString();
};
