import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetPlacedOrdersQuery } from '../../features/orders/orders.api';
import OrdersTable from '../../features/orders/OrdersTable';
import { Role } from '../../common/constants';

export default function PlacedOrders() {
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

  const response = useGetPlacedOrdersQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
    { label: 'Taken', to: '../taken' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  return (
    <OrdersTable
      {...response}
      title='Placed Orders'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
