import { useLocation, useSearchParams } from 'react-router-dom';
import {
  useGetAllMarketsQuery,
  useGetMainMarketsQuery,
  useGetMyMarketsQuery,
} from '../../features/markets/markets.api';
import MarketsTable from '../../features/markets/MarketsTable';
import {
  createMyMarketButton,
  createUserMarketButton,
} from '../../features/markets/CreateMarketModal';
import { editMarketAction } from '../../features/markets/EditMarketModal';

export default function MarketsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    market: searchParams.get('market'),
  };

  const response = {
    main: useGetMainMarketsQuery,
    my: useGetMyMarketsQuery,
    all: useGetAllMarketsQuery,
  }[tab]!(search);

  const button = {
    main: createMyMarketButton,
    my: createMyMarketButton,
    all: createUserMarketButton,
  }[tab];

  const actions = { my: [editMarketAction], all: [editMarketAction] }[tab];

  return (
    <MarketsTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
