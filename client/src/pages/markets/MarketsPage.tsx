import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
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

export default function MyMarkets() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    market: searchParams.get('market'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
  });

  const response = {
    main: useGetMainMarketsQuery,
    my: useGetMyMarketsQuery,
    all: useGetAllMarketsQuery,
  }[tab]!({ page, search });

  const button = {
    main: createMyMarketButton,
    my: createMyMarketButton,
    all: createUserMarketButton,
  }[tab];

  const actions = { my: [editMarketAction], all: [editMarketAction] }[tab];

  return (
    <MarketsTable
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
