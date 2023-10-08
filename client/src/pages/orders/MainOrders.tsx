import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMainOrdersQuery } from '../../features/orders/orders.api';
import OrdersTable from '../../features/orders/OrdersTable';
import { takeMyOrderAction } from '../../features/orders/TakeOrderModal';
import { Role } from '../../common/constants';

export default function MainOrders() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    modes: [Mode.CUSTOMER, Mode.EXECUTOR, Mode.OWNER],
    mode: null,
    storage: null,
    cell: null,
    item: null,
    description: '',
    status: null,
    rate: null,
  });

  const response = useGetMainOrdersQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'Taken', to: 'taken' },
    { label: 'Placed', to: 'placed' },
    { label: 'All', to: 'all', role: Role.MANAGER },
  ];

  const actions = [takeMyOrderAction];

  return (
    <OrdersTable
      {...response}
      title='Main Orders'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
