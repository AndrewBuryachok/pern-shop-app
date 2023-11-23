import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetTakenOrdersQuery } from '../../features/orders/orders.api';
import OrdersTable from '../../features/orders/OrdersTable';
import { untakeOrderAction } from '../../features/orders/UntakeOrderModal';
import { executeOrderAction } from '../../features/orders/ExecuteOrderModal';
import { Role } from '../../common/constants';

export default function TakenOrders() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.CUSTOMER, Mode.EXECUTOR, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    storage: searchParams.get('storage'),
    cell: searchParams.get('cell'),
    item: searchParams.get('item'),
    description: searchParams.get('description') || '',
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    status: searchParams.get('status'),
    rate: +(searchParams.get('rate') || 0) || null,
  });

  const response = useGetTakenOrdersQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.my'), to: '../my' },
    { label: t('pages.placed'), to: '../placed' },
    { label: t('pages.all'), to: '../all', role: Role.MANAGER },
  ];

  const actions = [untakeOrderAction, executeOrderAction];

  return (
    <OrdersTable
      {...response}
      title={t('pages.taken') + ' ' + t('navbar.orders')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
