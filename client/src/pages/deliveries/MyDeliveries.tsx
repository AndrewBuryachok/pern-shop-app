import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMyDeliveriesQuery } from '../../features/deliveries/deliveries.api';
import DeliveriesTable from '../../features/deliveries/DeliveriesTable';
import { createDeliveryButton } from '../../features/deliveries/CreateDeliveryModal';
import { completeDeliveryAction } from '../../features/deliveries/CompleteDeliveryModal';
import { rateDeliveryAction } from '../../features/deliveries/RateDeliveryModal';
import { deleteDeliveryAction } from '../../features/deliveries/DeleteDeliveryModal';
import { Role } from '../../common/constants';

export default function MyDeliveries() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.CUSTOMER, Mode.EXECUTOR, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    storage: searchParams.get('storage'),
    cell: searchParams.get('cell'),
    item: searchParams.get('item'),
    description: '',
    status: +(searchParams.get('status') || 0) || null,
    rate: +(searchParams.get('rate') || 0) || null,
  });

  const response = useGetMyDeliveriesQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'Taken', to: '../taken' },
    { label: 'Placed', to: '../placed' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  const button = createDeliveryButton;

  const actions = [
    completeDeliveryAction,
    rateDeliveryAction,
    deleteDeliveryAction,
  ];

  return (
    <DeliveriesTable
      {...response}
      title='My Deliveries'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      actions={actions}
    />
  );
}
