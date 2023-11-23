import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMainProductsQuery } from '../../features/products/products.api';
import ProductsTable from '../../features/products/ProductsTable';
import { buyProductAction } from '../../features/products/BuyProductModal';
import { Role } from '../../common/constants';

export default function MainProducts() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.SELLER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    storage: searchParams.get('storage'),
    cell: searchParams.get('cell'),
    item: searchParams.get('item'),
    description: searchParams.get('description') || '',
  });

  const response = useGetMainProductsQuery({ page, search });

  const links = [
    { label: t('pages.my'), to: 'my' },
    { label: t('pages.placed'), to: 'placed' },
    { label: t('pages.all'), to: 'all', role: Role.MANAGER },
  ];

  const actions = [buyProductAction];

  return (
    <ProductsTable
      {...response}
      title={t('pages.main') + ' ' + t('navbar.products')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
