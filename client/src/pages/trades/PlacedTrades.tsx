import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetPlacedTradesQuery } from '../../features/trades/trades.api';
import TradesTable from '../../features/trades/TradesTable';
import { Role } from '../../common/constants';

export default function PlacedTrades() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.BUYER, Mode.SELLER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    market: searchParams.get('market'),
    store: searchParams.get('store'),
    item: searchParams.get('item'),
    description: '',
    rate: +(searchParams.get('rate') || 0) || null,
  });

  const response = useGetPlacedTradesQuery({ page, search });

  const links = [
    { label: 'My', to: '../my' },
    { label: 'Selled', to: '../selled' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  return (
    <TradesTable
      {...response}
      title='Placed Trades'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
