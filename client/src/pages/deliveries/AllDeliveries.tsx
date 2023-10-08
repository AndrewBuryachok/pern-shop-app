import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllDeliveriesQuery } from '../../features/deliveries/deliveries.api';
import DeliveriesTable from '../../features/deliveries/DeliveriesTable';
import { takeUserDeliveryAction } from '../../features/deliveries/TakeDeliveryModal';
import { executeUserDeliveryAction } from '../../features/deliveries/ExecuteDeliveryModal';
import { completeUserDeliveryAction } from '../../features/deliveries/CompleteDeliveryModal';
import { rateUserDeliveryAction } from '../../features/deliveries/RateDeliveryModal';
import { untakeUserDeliveryAction } from '../../features/deliveries/UntakeDeliveryModal';
import { deleteUserDeliveryAction } from '../../features/deliveries/DeleteDeliveryModal';

export default function AllDeliveries() {
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

  const response = useGetAllDeliveriesQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
    { label: 'Taken', to: '../taken' },
    { label: 'Placed', to: '../placed' },
  ];

  const actions = [
    takeUserDeliveryAction,
    executeUserDeliveryAction,
    completeUserDeliveryAction,
    untakeUserDeliveryAction,
    deleteUserDeliveryAction,
    rateUserDeliveryAction,
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
