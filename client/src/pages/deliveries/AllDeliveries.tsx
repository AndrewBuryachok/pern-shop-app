import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllDeliveriesQuery } from '../../features/deliveries/deliveries.api';
import DeliveriesTable from '../../features/deliveries/DeliveriesTable';
import { takeUserDeliveryAction } from '../../features/deliveries/TakeDeliveryModal';
import { executeDeliveryAction } from '../../features/deliveries/ExecuteDeliveryModal';
import { completeDeliveryAction } from '../../features/deliveries/CompleteDeliveryModal';
import { rateDeliveryAction } from '../../features/deliveries/RateDeliveryModal';
import { untakeDeliveryAction } from '../../features/deliveries/UntakeDeliveryModal';
import { deleteDeliveryAction } from '../../features/deliveries/DeleteDeliveryModal';

export default function AllDeliveries() {
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

  const response = useGetAllDeliveriesQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
    { label: 'Taken', to: '../taken' },
    { label: 'Placed', to: '../placed' },
  ];

  const actions = [
    takeUserDeliveryAction,
    executeDeliveryAction,
    completeDeliveryAction,
    untakeDeliveryAction,
    deleteDeliveryAction,
    rateDeliveryAction,
  ];

  return (
    <DeliveriesTable
      {...response}
      title='All Deliveries'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
