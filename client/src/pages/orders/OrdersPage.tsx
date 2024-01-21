import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import {
  useGetAllOrdersQuery,
  useGetMainOrdersQuery,
  useGetMyOrdersQuery,
  useGetPlacedOrdersQuery,
  useGetTakenOrdersQuery,
} from '../../features/orders/orders.api';
import OrdersTable from '../../features/orders/OrdersTable';
import {
  createMyOrderButton,
  createUserOrderButton,
} from '../../features/orders/CreateOrderModal';
import { rateOrderAction } from '../../features/orders/RateOrderModal';
import {
  takeMyOrderAction,
  takeUserOrderAction,
} from '../../features/orders/TakeOrderModal';
import { executeOrderAction } from '../../features/orders/ExecuteOrderModal';
import { completeOrderAction } from '../../features/orders/CompleteOrderModal';
import { untakeOrderAction } from '../../features/orders/UntakeOrderModal';
import { deleteOrderAction } from '../../features/orders/DeleteOrderModal';

export default function OrdersPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
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
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    main: useGetMainOrdersQuery,
    my: useGetMyOrdersQuery,
    taken: useGetTakenOrdersQuery,
    placed: useGetPlacedOrdersQuery,
    all: useGetAllOrdersQuery,
  }[tab]!({ page, search });

  const button = {
    main: createMyOrderButton,
    my: createMyOrderButton,
    all: createUserOrderButton,
  }[tab];

  const actions = {
    main: [takeMyOrderAction],
    my: [completeOrderAction, rateOrderAction, deleteOrderAction],
    taken: [untakeOrderAction, executeOrderAction],
    all: [
      takeUserOrderAction,
      executeOrderAction,
      completeOrderAction,
      untakeOrderAction,
      deleteOrderAction,
      rateOrderAction,
    ],
  }[tab];

  return (
    <OrdersTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
      actions={actions}
    />
  );
}
