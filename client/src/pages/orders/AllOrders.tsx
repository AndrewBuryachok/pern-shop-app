import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllOrdersQuery } from '../../features/orders/orders.api';
import OrdersTable from '../../features/orders/OrdersTable';
import { createUserOrderButton } from '../../features/orders/CreateOrderModal';
import { takeUserOrderAction } from '../../features/orders/TakeOrderModal';
import { executeOrderAction } from '../../features/orders/ExecuteOrderModal';
import { completeOrderAction } from '../../features/orders/CompleteOrderModal';
import { rateOrderAction } from '../../features/orders/RateOrderModal';
import { untakeOrderAction } from '../../features/orders/UntakeOrderModal';
import { deleteOrderAction } from '../../features/orders/DeleteOrderModal';

export default function AllOrders() {
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
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
    status: searchParams.get('status'),
    rate: +(searchParams.get('rate') || 0) || null,
  });

  const response = useGetAllOrdersQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.my'), to: '../my' },
    { label: t('pages.taken'), to: '../taken' },
    { label: t('pages.placed'), to: '../placed' },
  ];

  const button = createUserOrderButton;

  const actions = [
    takeUserOrderAction,
    executeOrderAction,
    completeOrderAction,
    untakeOrderAction,
    deleteOrderAction,
    rateOrderAction,
  ];

  return (
    <OrdersTable
      {...response}
      title={t('pages.all') + ' ' + t('navbar.orders')}
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
