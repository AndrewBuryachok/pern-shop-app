import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetTakenOrdersQuery } from '../../features/orders/orders.api';
import OrdersTable from '../../features/orders/OrdersTable';
import { untakeOrderAction } from '../../features/orders/UntakeOrderModal';
import { executeOrderAction } from '../../features/orders/ExecuteOrderModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function TakenOrders() {
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
  });

  const response = useGetTakenOrdersQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.MANAGER) },
  ];

  const actions = [untakeOrderAction, executeOrderAction];

  return (
    <OrdersTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
      title='Taken Orders'
    />
  );
}
