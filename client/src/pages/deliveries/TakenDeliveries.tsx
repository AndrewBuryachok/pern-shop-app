import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetTakenDeliveriesQuery } from '../../features/deliveries/deliveries.api';
import DeliveriesTable from '../../features/deliveries/DeliveriesTable';
import { untakeDeliveryAction } from '../../features/deliveries/UntakeDeliveryModal';
import { executeDeliveryAction } from '../../features/deliveries/ExecuteDeliveryModal';
import { Role } from '../../common/constants';

export default function TakenDeliveries() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    filters: [
      Filter.SENDER,
      Filter.RECEIVER,
      Filter.EXECUTOR,
      Filter.OWNER,
    ].map((label) => ({ label, value: true })),
    mode: Mode.SOME,
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

  const actions = [untakeDeliveryAction, executeDeliveryAction];

  return (
    <DeliveriesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
      title='Taken Deliveries'
    />
  );
}
