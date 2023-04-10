import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetMyDeliveriesQuery } from '../../features/deliveries/deliveries.api';
import DeliveriesTable from '../../features/deliveries/DeliveriesTable';
import { createDeliveryButton } from '../../features/deliveries/CreateDeliveryModal';
import { completeDeliveryAction } from '../../features/deliveries/CompleteDeliveryModal';
import { deleteDeliveryAction } from '../../features/deliveries/DeleteDeliveryModal';
import { Role } from '../../common/constants';

export default function MyDeliveries() {
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
  });

  const response = useGetMyDeliveriesQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'Taken', to: '../taken' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  const button = createDeliveryButton;

  const actions = [completeDeliveryAction, deleteDeliveryAction];

  return (
    <DeliveriesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      actions={actions}
      title='My Deliveries'
    />
  );
}
