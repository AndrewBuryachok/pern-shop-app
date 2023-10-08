import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetPlacedProductsQuery } from '../../features/products/products.api';
import ProductsTable from '../../features/products/ProductsTable';
import { Role } from '../../common/constants';

export default function PlacedProducts() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    modes: [Mode.SELLER, Mode.OWNER],
    mode: null,
    storage: null,
    cell: null,
    item: null,
    description: '',
  });

  const response = useGetPlacedProductsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  return (
    <ProductsTable
      {...response}
      title='Placed Products'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
