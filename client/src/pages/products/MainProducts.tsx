import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMainProductsQuery } from '../../features/products/products.api';
import ProductsTable from '../../features/products/ProductsTable';
import { buyProductAction } from '../../features/products/BuyProductModal';
import { Role } from '../../common/constants';

export default function MainProducts() {
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

  const response = useGetMainProductsQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'Placed', to: 'placed' },
    { label: 'All', to: 'all', role: Role.MANAGER },
  ];

  const actions = [buyProductAction];

  return (
    <ProductsTable
      {...response}
      title='Main Products'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
