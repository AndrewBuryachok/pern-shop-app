import { useLocation, useSearchParams } from 'react-router-dom';
import { Mode } from '../../common/enums';
import {
  useGetAllMDeliveriesQuery,
  useGetMainMDeliveriesQuery,
  useGetMyMDeliveriesQuery,
  useGetPlacedMDeliveriesQuery,
  useGetTakenMDeliveriesQuery,
} from '../../features/markets-deliveries/markets-deliveries.api';
import MarketsDeliveriesTable from '../../features/markets-deliveries/MarketsDeliveriesTable';
import {
  createMyMarketDeliveryButton,
  createUserMarketDeliveryButton,
} from '../../features/markets-deliveries/CreateMarketDeliveryModal';
import { editMarketDeliveryAction } from '../../features/markets-deliveries/EditMarketDeliveryModal';
import {
  takeMyMarketDeliveryAction,
  takeUserMarketDeliveryAction,
} from '../../features/markets-deliveries/TakeMarketDeliveryModal';
import { executeMarketDeliveryAction } from '../../features/markets-deliveries/ExecuteMarketDeliveryModal';
import { completeMarketDeliveryAction } from '../../features/markets-deliveries/CompleteMarketDeliveryModal';
import { untakeMarketDeliveryAction } from '../../features/markets-deliveries/UntakeMarketDeliveryModal';
import { deleteMarketDeliveryAction } from '../../features/markets-deliveries/DeleteMarketDeliveryModal';
import { rateMarketDeliveryAction } from '../../features/markets-deliveries/RateMarketDeliveryModal';

export default function MarketsDeliveriesPage() {
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
    main: createMyMarketDeliveryButton,
    my: createMyMarketDeliveryButton,
    all: createUserMarketDeliveryButton,
  }[tab];

  const actions = {
    main: [takeMyMarketDeliveryAction],
    my: [
      editMarketDeliveryAction,
      completeMarketDeliveryAction,
      deleteMarketDeliveryAction,
      rateMarketDeliveryAction,
    ],
    taken: [executeMarketDeliveryAction, untakeMarketDeliveryAction],
    all: [
      editMarketDeliveryAction,
      takeUserMarketDeliveryAction,
      executeMarketDeliveryAction,
      completeMarketDeliveryAction,
      untakeMarketDeliveryAction,
      deleteMarketDeliveryAction,
      rateMarketDeliveryAction,
    ],
  }[tab];

  return (
    <MarketsDeliveriesTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
