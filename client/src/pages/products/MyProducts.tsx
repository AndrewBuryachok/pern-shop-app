import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMyProductsQuery } from '../../features/products/products.api';
import ProductsTable from '../../features/products/ProductsTable';
import { createProductButton } from '../../features/products/CreateProductModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyProducts() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: '',
    filters: ['Mode', 'Seller', 'Owner'].map((label, index) => ({
      label,
      value: !!index,
    })),
    item: '',
    description: '',
  });

  const response = useGetMyProductsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
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
