import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetMainOrdersQuery } from '../../features/orders/orders.api';
import OrdersTable from '../../features/orders/OrdersTable';
import { takeOrderAction } from '../../features/orders/TakeOrderModal';
import { Role } from '../../common/constants';

export default function MainOrders() {
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

  const response = useGetMainOrdersQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'Taken', to: 'taken' },
    { label: 'Placed', to: 'placed' },
    { label: 'All', to: 'all', role: Role.MANAGER },
  ];

  const actions = [takeOrderAction];

  return (
    <OrdersTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='Main Orders'
      actions={actions}
    />
  );
}
