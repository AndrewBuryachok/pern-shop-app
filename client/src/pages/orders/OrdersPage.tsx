import { useLocation, useSearchParams } from 'react-router-dom';
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
import {
  editMyOrderAction,
  editUserOrderAction,
} from '../../features/orders/EditOrderModal';
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

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.CUSTOMER, Mode.EXECUTOR, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    station: searchParams.get('station'),
    box: searchParams.get('box'),
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
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
    completed: searchParams.get('completed'),
    rate: +(searchParams.get('rate') || 0) || null,
  };

  const response = {
    main: useGetMainOrdersQuery,
    my: useGetMyOrdersQuery,
    taken: useGetTakenOrdersQuery,
    placed: useGetPlacedOrdersQuery,
    all: useGetAllOrdersQuery,
  }[tab]!(search);

  const button = {
    main: createMyOrderButton,
    my: createMyOrderButton,
    all: createUserOrderButton,
  }[tab];

  const actions = {
    main: [takeMyOrderAction],
    my: [editMyOrderAction, completeOrderAction, deleteOrderAction],
    taken: [executeOrderAction, untakeOrderAction],
    all: [
      editUserOrderAction,
      takeUserOrderAction,
      executeOrderAction,
      completeOrderAction,
      untakeOrderAction,
      deleteOrderAction,
    ],
  }[tab];

  return (
    <OrdersTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
