import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllOrdersQuery } from '../../features/orders/orders.api';
import OrdersTable from '../../features/orders/OrdersTable';
import { takeUserOrderAction } from '../../features/orders/TakeOrderModal';
import { executeUserOrderAction } from '../../features/orders/ExecuteOrderModal';
import { completeUserOrderAction } from '../../features/orders/CompleteOrderModal';
import { rateUserOrderAction } from '../../features/orders/RateOrderModal';
import { untakeUserOrderAction } from '../../features/orders/UntakeOrderModal';
import { deleteUserOrderAction } from '../../features/orders/DeleteOrderModal';

export default function AllOrders() {
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
    description: '',
    status: +(searchParams.get('status') || 0) || null,
    rate: +(searchParams.get('rate') || 0) || null,
  });

  const response = useGetAllOrdersQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
    { label: 'Taken', to: '../taken' },
    { label: 'Placed', to: '../placed' },
  ];

  const actions = [
    takeUserOrderAction,
    executeUserOrderAction,
    completeUserOrderAction,
    untakeUserOrderAction,
    deleteUserOrderAction,
    rateUserOrderAction,
  ];

  return (
    <OrdersTable
      {...response}
      title='All Orders'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
