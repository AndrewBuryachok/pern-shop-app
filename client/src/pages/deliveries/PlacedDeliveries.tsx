import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetPlacedDeliveriesQuery } from '../../features/deliveries/deliveries.api';
import DeliveriesTable from '../../features/deliveries/DeliveriesTable';
import { Role } from '../../common/constants';

export default function PlacedDeliveries() {
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

  const response = useGetPlacedDeliveriesQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
    { label: 'Taken', to: '../taken' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  return (
    <DeliveriesTable
      {...response}
      title='Placed Deliveries'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
