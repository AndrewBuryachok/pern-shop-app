import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import {
  useGetAllDeliveriesQuery,
  useGetMainDeliveriesQuery,
  useGetMyDeliveriesQuery,
  useGetPlacedDeliveriesQuery,
  useGetTakenDeliveriesQuery,
} from '../../features/deliveries/deliveries.api';
import DeliveriesTable from '../../features/deliveries/DeliveriesTable';
import {
  createMyDeliveryButton,
  createUserDeliveryButton,
} from '../../features/deliveries/CreateDeliveryModal';
import { rateDeliveryAction } from '../../features/deliveries/RateDeliveryModal';
import {
  takeMyDeliveryAction,
  takeUserDeliveryAction,
} from '../../features/deliveries/TakeDeliveryModal';
import { executeDeliveryAction } from '../../features/deliveries/ExecuteDeliveryModal';
import { completeDeliveryAction } from '../../features/deliveries/CompleteDeliveryModal';
import { untakeDeliveryAction } from '../../features/deliveries/UntakeDeliveryModal';
import { deleteDeliveryAction } from '../../features/deliveries/DeleteDeliveryModal';

export default function DeliveriesPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.CUSTOMER, Mode.EXECUTOR, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    storage: searchParams.get('storage'),
    cell: searchParams.get('cell'),
    item: searchParams.get('item'),
    description: searchParams.get('description') || '',
    minAmount: +(searchParams.get('minAmount') || 0) || null,
    maxAmount: +(searchParams.get('maxAmount') || 0) || null,
    minIntake: +(searchParams.get('minIntake') || 0) || null,
    maxIntake: +(searchParams.get('maxIntake') || 0) || null,
    kit: searchParams.get('kit'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    status: searchParams.get('status'),
    rate: +(searchParams.get('rate') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    main: useGetMainDeliveriesQuery,
    my: useGetMyDeliveriesQuery,
    taken: useGetTakenDeliveriesQuery,
    placed: useGetPlacedDeliveriesQuery,
    all: useGetAllDeliveriesQuery,
  }[tab]!({ page, search });

  const button = {
    main: createMyDeliveryButton,
    my: createMyDeliveryButton,
    all: createUserDeliveryButton,
  }[tab];

  const actions = {
    main: [takeMyDeliveryAction],
    my: [completeDeliveryAction, rateDeliveryAction, deleteDeliveryAction],
    taken: [untakeDeliveryAction, executeDeliveryAction],
    all: [
      takeUserDeliveryAction,
      executeDeliveryAction,
      completeDeliveryAction,
      untakeDeliveryAction,
      deleteDeliveryAction,
      rateDeliveryAction,
    ],
  }[tab];

  return (
    <DeliveriesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
      actions={actions}
    />
  );
}
