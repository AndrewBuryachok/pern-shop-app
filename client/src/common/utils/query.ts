import { IRequest } from '../interfaces';
import { ROWS_PER_PAGE } from '../constants';

export const getQuery = ({ page, search }: IRequest) => {
  const query = new URLSearchParams();
  if (page) {
    query.append('skip', `${(page - 1) * ROWS_PER_PAGE}`);
    query.append('take', `${ROWS_PER_PAGE}`);
  }
  if (search?.user) {
    query.append('user', `${search.user}`);
  }
  if (search?.filters?.find((filter) => filter.label === 'Mode')?.value) {
    query.append('mode', 'true');
  }
  const filters = search?.filters?.filter(
    (filter) => filter.label !== 'Mode' && filter.value,
  );
  if (filters?.length) {
    query.append(
      'filters',
      filters.map((filter) => filter.label.toLowerCase()).join(),
    );
  }
  if (search?.name) {
    query.append('name', search.name);
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
  return query.toString();
};
