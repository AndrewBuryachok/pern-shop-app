import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllProductsQuery } from '../../features/products/products.api';
import ProductsTable from '../../features/products/ProductsTable';

export default function AllProducts() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: '',
    card: '',
    mode: 'false',
    filters: ['Seller', 'Owner'].map((label) => ({
      label,
      value: true,
    })),
    storage: '',
    cell: '',
    item: '',
    description: '',
  });

  const response = useGetAllProductsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
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
