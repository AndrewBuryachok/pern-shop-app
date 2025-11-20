import { useLocation, useSearchParams } from 'react-router-dom';
import { Mode } from '../../common/enums';
import {
  useGetAllDeliveriesQuery,
  useGetMainDeliveriesQuery,
  useGetMyDeliveriesQuery,
  useGetTakenDeliveriesQuery,
} from '../../features/deliveries/deliveries.api';
import DeliveriesTable from '../../features/deliveries/DeliveriesTable';
import {
  createMyDeliveryButton,
  createUserDeliveryButton,
} from '../../features/deliveries/CreateDeliveryModal';
import {
  editMyDeliveryAction,
  editUserDeliveryAction,
} from '../../features/deliveries/EditDeliveryModal';
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

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.CUSTOMER, Mode.EXECUTOR, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    shop: searchParams.get('shop'),
    market: searchParams.get('market'),
    stall: searchParams.get('stall'),
    storage: searchParams.get('storage'),
    cell: searchParams.get('cell'),
    station: searchParams.get('station'),
    box: searchParams.get('box'),
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
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
    completed: searchParams.get('completed'),
    rate: +(searchParams.get('rate') || 0) || null,
  };

  const response = {
    main: useGetMainDeliveriesQuery,
    my: useGetMyDeliveriesQuery,
    taken: useGetTakenDeliveriesQuery,
    all: useGetAllDeliveriesQuery,
  }[tab]!(search);

  const button = {
    main: createMyDeliveryButton,
    my: createMyDeliveryButton,
    all: createUserDeliveryButton,
  }[tab];

  const actions = {
    main: [takeMyDeliveryAction],
    my: [editMyDeliveryAction, completeDeliveryAction, deleteDeliveryAction],
    taken: [executeDeliveryAction, untakeDeliveryAction],
    all: [
      editUserDeliveryAction,
      takeUserDeliveryAction,
      executeDeliveryAction,
      completeDeliveryAction,
      untakeDeliveryAction,
      deleteDeliveryAction,
    ],
  }[tab];

  return (
    <DeliveriesTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
