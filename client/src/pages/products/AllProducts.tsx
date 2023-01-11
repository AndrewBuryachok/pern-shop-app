import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetAllProductsQuery } from '../../features/products/products.api';
import ProductsTable from '../../features/products/ProductsTable';

export default function AllProducts() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetAllProductsQuery({ page, search: debounced });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
    { label: 'Placed', to: '../placed' },
  ];

  return (
    <ProductsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Products'
    />
  );
}
