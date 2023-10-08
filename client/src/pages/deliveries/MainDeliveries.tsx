import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMainDeliveriesQuery } from '../../features/deliveries/deliveries.api';
import DeliveriesTable from '../../features/deliveries/DeliveriesTable';
import { takeMyDeliveryAction } from '../../features/deliveries/TakeDeliveryModal';
import { Role } from '../../common/constants';

export default function MainDeliveries() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    modes: [Mode.SENDER, Mode.RECEIVER, Mode.EXECUTOR, Mode.OWNER],
    mode: null,
    storage: null,
    cell: null,
    item: null,
    description: '',
    status: null,
    rate: null,
  });

  const response = useGetMainDeliveriesQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'Taken', to: 'taken' },
    { label: 'Placed', to: 'placed' },
    { label: 'All', to: 'all', role: Role.MANAGER },
  ];

  const actions = [takeMyDeliveryAction];

  return (
    <DeliveriesTable
      {...response}
      title='Main Deliveries'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
