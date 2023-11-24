import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMainOrdersQuery } from '../../features/orders/orders.api';
import OrdersTable from '../../features/orders/OrdersTable';
import { takeMyOrderAction } from '../../features/orders/TakeOrderModal';
import { Role } from '../../common/constants';

export default function MainOrders() {
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
    minAmount: +(searchParams.get('minAmount') || 0) || null,
    maxAmount: +(searchParams.get('maxAmount') || 0) || null,
    minIntake: +(searchParams.get('minIntake') || 0) || null,
    maxIntake: +(searchParams.get('maxIntake') || 0) || null,
    kit: searchParams.get('kit'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    status: searchParams.get('status'),
    rate: +(searchParams.get('rate') || 0) || null,
  });

  const response = useGetMainOrdersQuery({ page, search });

  const links = [
    { label: t('pages.my'), to: 'my' },
    { label: t('pages.taken'), to: 'taken' },
    { label: t('pages.placed'), to: 'placed' },
    { label: t('pages.all'), to: 'all', role: Role.MANAGER },
  ];

  const actions = [takeMyOrderAction];

  return (
    <OrdersTable
      {...response}
      title={t('pages.main') + ' ' + t('navbar.orders')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
