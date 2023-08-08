import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetMyOrdersQuery } from '../../features/orders/orders.api';
import OrdersTable from '../../features/orders/OrdersTable';
import { createOrderButton } from '../../features/orders/CreateOrderModal';
import { completeMyOrderAction } from '../../features/orders/CompleteOrderModal';
import { rateMyOrderAction } from '../../features/orders/RateOrderModal';
import { deleteMyOrderAction } from '../../features/orders/DeleteOrderModal';
import { Role } from '../../common/constants';

export default function MyOrders() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    filters: [Filter.CUSTOMER, Filter.EXECUTOR, Filter.OWNER].map((label) => ({
      label,
      value: true,
    })),
    mode: Mode.SOME,
    storage: null,
    cell: null,
    item: null,
    description: '',
    status: null,
    rate: null,
  });

  const response = useGetMyOrdersQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'Taken', to: '../taken' },
    { label: 'Placed', to: '../placed' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  const button = createOrderButton;

  const actions = [
    completeMyOrderAction,
    rateMyOrderAction,
    deleteMyOrderAction,
  ];

  return (
    <OrdersTable
      {...response}
      title='My Orders'
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
