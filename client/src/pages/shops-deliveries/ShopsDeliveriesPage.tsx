import { useLocation, useSearchParams } from 'react-router-dom';
import { Mode } from '../../common/enums';
import {
  useGetAllMDeliveriesQuery,
  useGetMainMDeliveriesQuery,
  useGetMyMDeliveriesQuery,
  useGetPlacedMDeliveriesQuery,
  useGetTakenMDeliveriesQuery,
} from '../../features/shops-deliveries/shops-deliveries.api';
import ShopsDeliveriesTable from '../../features/shops-deliveries/ShopsDeliveriesTable';
import {
  createMyShopDeliveryButton,
  createUserShopDeliveryButton,
} from '../../features/shops-deliveries/CreateShopDeliveryModal';
import {
  editMyShopDeliveryAction,
  editUserShopDeliveryAction,
} from '../../features/shops-deliveries/EditShopDeliveryModal';
import {
  takeMyShopDeliveryAction,
  takeUserShopDeliveryAction,
} from '../../features/shops-deliveries/TakeShopDeliveryModal';
import { executeShopDeliveryAction } from '../../features/shops-deliveries/ExecuteShopDeliveryModal';
import { completeShopDeliveryAction } from '../../features/shops-deliveries/CompleteShopDeliveryModal';
import { untakeShopDeliveryAction } from '../../features/shops-deliveries/UntakeShopDeliveryModal';
import { deleteShopDeliveryAction } from '../../features/shops-deliveries/DeleteShopDeliveryModal';
import { rateShopDeliveryAction } from '../../features/shops-deliveries/RateShopDeliveryModal';

export default function ShopsDeliveriesPage() {
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
    rate: +(searchParams.get('rate') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
    completed: searchParams.get('completed'),
  };

  const response = {
    main: useGetMainMDeliveriesQuery,
    my: useGetMyMDeliveriesQuery,
    taken: useGetTakenMDeliveriesQuery,
    placed: useGetPlacedMDeliveriesQuery,
    all: useGetAllMDeliveriesQuery,
  }[tab]!(search);

  const button = {
    main: createMyShopDeliveryButton,
    my: createMyShopDeliveryButton,
    all: createUserShopDeliveryButton,
  }[tab];

  const actions = {
    main: [takeMyShopDeliveryAction],
    my: [
      editMyShopDeliveryAction,
      completeShopDeliveryAction,
      deleteShopDeliveryAction,
      rateShopDeliveryAction,
    ],
    taken: [executeShopDeliveryAction, untakeShopDeliveryAction],
    all: [
      editUserShopDeliveryAction,
      takeUserShopDeliveryAction,
      executeShopDeliveryAction,
      completeShopDeliveryAction,
      untakeShopDeliveryAction,
      deleteShopDeliveryAction,
      rateShopDeliveryAction,
    ],
  }[tab];

  return (
    <ShopsDeliveriesTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
