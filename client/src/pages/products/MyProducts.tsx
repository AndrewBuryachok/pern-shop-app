import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetMyProductsQuery } from '../../features/products/products.api';
import ProductsTable from '../../features/products/ProductsTable';
import { createProductButton } from '../../features/products/CreateProductModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyProducts() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetMyProductsQuery({ page, search: debounced });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'Placed', to: '../placed' },
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.MANAGER) },
  ];

  const button = createProductButton;

  return (
    <ProductsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      title='My Products'
    />
  );
}
