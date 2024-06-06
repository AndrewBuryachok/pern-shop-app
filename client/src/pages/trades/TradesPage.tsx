import { useLocation, useSearchParams } from 'react-router-dom';
import { Mode } from '../../common/enums';
import {
  useGetAllTradesQuery,
  useGetMyTradesQuery,
  useGetPlacedTradesQuery,
  useGetSoldTradesQuery,
} from '../../features/trades/trades.api';
import TradesTable from '../../features/trades/TradesTable';
import { rateTradeAction } from '../../features/trades/RateTradeModal';

export default function TradesPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.BUYER, Mode.SELLER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    market: searchParams.get('market'),
    store: searchParams.get('store'),
    item: searchParams.get('item'),
    description: searchParams.get('description') || '',
    minAmount: +(searchParams.get('minAmount') || 0) || null,
    maxAmount: +(searchParams.get('maxAmount') || 0) || null,
    minIntake: +(searchParams.get('minIntake') || 0) || null,
    maxIntake: +(searchParams.get('maxIntake') || 0) || null,
    kit: searchParams.get('kit'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    rate: +(searchParams.get('rate') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  };

  const response = {
    my: useGetMyTradesQuery,
    sold: useGetSoldTradesQuery,
    placed: useGetPlacedTradesQuery,
    all: useGetAllTradesQuery,
  }[tab]!(search);

  const actions = { my: [rateTradeAction], all: [rateTradeAction] }[tab];

  return <TradesTable {...response} search={search} actions={actions} />;
}
