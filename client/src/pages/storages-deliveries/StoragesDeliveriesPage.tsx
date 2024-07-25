import { useLocation, useSearchParams } from 'react-router-dom';
import { Mode } from '../../common/enums';
import {
  useGetAllSDeliveriesQuery,
  useGetMainSDeliveriesQuery,
  useGetMySDeliveriesQuery,
  useGetPlacedSDeliveriesQuery,
  useGetTakenSDeliveriesQuery,
} from '../../features/storages-deliveries/storages-deliveries.api';
import StoragesDeliveriesTable from '../../features/storages-deliveries/StoragesDeliveriesTable';
import {
  createMyStorageDeliveryButton,
  createUserStorageDeliveryButton,
} from '../../features/storages-deliveries/CreateStorageDeliveryModal';
import {
  takeMyStorageDeliveryAction,
  takeUserStorageDeliveryAction,
} from '../../features/storages-deliveries/TakeStorageDeliveryModal';
import { executeStorageDeliveryAction } from '../../features/storages-deliveries/ExecuteStorageDeliveryModal';
import { completeStorageDeliveryAction } from '../../features/storages-deliveries/CompleteStorageDeliveryModal';
import { untakeStorageDeliveryAction } from '../../features/storages-deliveries/UntakeStorageDeliveryModal';
import { deleteStorageDeliveryAction } from '../../features/storages-deliveries/DeleteStorageDeliveryModal';
import { rateStorageDeliveryAction } from '../../features/storages-deliveries/RateStorageDeliveryModal';

export default function StoragesDeliveriesPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.CUSTOMER, Mode.EXECUTOR, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    station: searchParams.get('station'),
    drawer: searchParams.get('drawer'),
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
  };

  const response = {
    main: useGetMainSDeliveriesQuery,
    my: useGetMySDeliveriesQuery,
    taken: useGetTakenSDeliveriesQuery,
    placed: useGetPlacedSDeliveriesQuery,
    all: useGetAllSDeliveriesQuery,
  }[tab]!(search);

  const button = {
    main: createMyStorageDeliveryButton,
    my: createMyStorageDeliveryButton,
    all: createUserStorageDeliveryButton,
  }[tab];

  const actions = {
    main: [takeMyStorageDeliveryAction],
    my: [
      completeStorageDeliveryAction,
      deleteStorageDeliveryAction,
      rateStorageDeliveryAction,
    ],
    taken: [untakeStorageDeliveryAction, executeStorageDeliveryAction],
    all: [
      takeUserStorageDeliveryAction,
      executeStorageDeliveryAction,
      completeStorageDeliveryAction,
      untakeStorageDeliveryAction,
      deleteStorageDeliveryAction,
      rateStorageDeliveryAction,
    ],
  }[tab];

  return (
    <StoragesDeliveriesTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
