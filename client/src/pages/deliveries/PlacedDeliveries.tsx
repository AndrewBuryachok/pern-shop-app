import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetPlacedDeliveriesQuery } from '../../features/deliveries/deliveries.api';
import DeliveriesTable from '../../features/deliveries/DeliveriesTable';
import { Role } from '../../common/constants';

export default function PlacedDeliveries() {
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
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='Placed Deliveries'
    />
  );
}
