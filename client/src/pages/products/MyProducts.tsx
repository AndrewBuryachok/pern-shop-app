import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetMyProductsQuery } from '../../features/products/products.api';
import ProductsTable from '../../features/products/ProductsTable';
import { createProductButton } from '../../features/products/CreateProductModal';
import { Role } from '../../common/constants';

export default function MyProducts() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    filters: [Filter.SELLER, Filter.OWNER].map((label) => ({
      label,
      value: true,
    })),
    mode: Mode.SOME,
    storage: null,
    cell: null,
    item: null,
    description: '',
  });

  const response = useGetMyProductsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', role: Role.MANAGER },
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
