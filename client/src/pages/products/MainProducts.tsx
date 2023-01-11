import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetMainProductsQuery } from '../../features/products/products.api';
import ProductsTable from '../../features/products/ProductsTable';
import { buyProductAction } from '../../features/products/BuyProductModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MainProducts() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetMainProductsQuery({ page, search: debounced });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'Placed', to: 'placed' },
    { label: 'All', to: 'all', disabled: isUserNotHasRole(Role.MANAGER) },
  ];

  const actions = [buyProductAction];

  return (
    <ProductsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='Main Products'
      actions={actions}
    />
  );
}
