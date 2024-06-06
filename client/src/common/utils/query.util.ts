import { IRequest } from '../interfaces';
import { ROWS_PER_PAGE } from '../constants';

export const getQuery = (req: IRequest) => {
  const query = new URLSearchParams();
  if (req.page) {
    query.append('skip', `${(req.page - 1) * ROWS_PER_PAGE}`);
    query.append('take', `${ROWS_PER_PAGE}`);
  }
  if (req?.id) {
    query.append('id', `${req.id}`);
  }
  if (req?.user) {
    query.append('user', req.user);
  }
  if (req?.card) {
    query.append('card', req.card);
  }
  if (req?.mode) {
    query.append('mode', req.mode);
  }
  if (req?.roles?.length) {
    query.append('roles', req.roles.join());
  }
  if (req?.city) {
    query.append('city', req.city);
  }
  if (req?.shop) {
    query.append('shop', req.shop);
  }
  if (req?.market) {
    query.append('market', req.market);
  }
  if (req?.storage) {
    query.append('storage', req.storage);
  }
  if (req?.marketTag) {
    query.append('marketTag', req.marketTag);
  }
  if (req?.storageTag) {
    query.append('storageTag', req.storageTag);
  }
  if (req?.store) {
    query.append('store', req.store);
  }
  if (req?.cell) {
    query.append('cell', req.cell);
  }
  if (req?.item) {
    query.append('item', req.item);
  }
  if (req?.title) {
    query.append('title', req.title);
  }
  if (req?.description) {
    query.append('description', req.description);
  }
  if (req?.type) {
    query.append('type', req.type);
  }
  if (req?.minSum) {
    query.append('minSum', `${req.minSum}`);
  }
  if (req?.maxSum) {
    query.append('maxSum', `${req.maxSum}`);
  }
  if (req?.minAmount) {
    query.append('minAmount', `${req.minAmount}`);
  }
  if (req?.maxAmount) {
    query.append('maxAmount', `${req.maxAmount}`);
  }
  if (req?.minIntake) {
    query.append('minIntake', `${req.minIntake}`);
  }
  if (req?.maxIntake) {
    query.append('maxIntake', `${req.maxIntake}`);
  }
  if (req?.kit) {
    query.append('kit', req.kit);
  }
  if (req?.minPrice) {
    query.append('minPrice', `${req.minPrice}`);
  }
  if (req?.maxPrice) {
    query.append('maxPrice', `${req.maxPrice}`);
  }
  if (req?.kind) {
    query.append('kind', req.kind);
  }
  if (req?.status) {
    query.append('status', req.status);
  }
  if (req?.mark) {
    query.append('mark', req.mark);
  }
  if (req?.result) {
    query.append('result', req.result);
  }
  if (req?.rate) {
    query.append('rate', `${req.rate}`);
  }
  if (req?.minDate) {
    query.append('minDate', req.minDate);
  }
  if (req?.maxDate) {
    query.append('maxDate', req.maxDate);
  }
  return query.toString();
};
