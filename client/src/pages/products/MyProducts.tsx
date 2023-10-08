import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMyProductsQuery } from '../../features/products/products.api';
import ProductsTable from '../../features/products/ProductsTable';
import { createMyProductButton } from '../../features/products/CreateProductModal';
import { editProductAction } from '../../features/products/EditProductModal';
import { Role } from '../../common/constants';

export default function MyProducts() {
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

  const response = useGetMyProductsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'Placed', to: '../placed' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  const button = createMyProductButton;

  const actions = [editProductAction];

  return (
    <ProductsTable
      {...response}
      title='My Products'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      actions={actions}
    />
  );
}
