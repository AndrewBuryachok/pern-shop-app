import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetTakenDeliveriesQuery } from '../../features/deliveries/deliveries.api';
import DeliveriesTable from '../../features/deliveries/DeliveriesTable';
import { untakeMyDeliveryAction } from '../../features/deliveries/UntakeDeliveryModal';
import { executeMyDeliveryAction } from '../../features/deliveries/ExecuteDeliveryModal';
import { Role } from '../../common/constants';

export default function TakenDeliveries() {
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

  const response = useGetTakenDeliveriesQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
    { label: 'Placed', to: '../placed' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  const actions = [untakeMyDeliveryAction, executeMyDeliveryAction];

  return (
    <DeliveriesTable
      {...response}
      title='Taken Deliveries'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
