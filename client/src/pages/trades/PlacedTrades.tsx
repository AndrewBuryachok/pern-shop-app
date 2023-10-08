import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetPlacedTradesQuery } from '../../features/trades/trades.api';
import TradesTable from '../../features/trades/TradesTable';
import { Role } from '../../common/constants';

export default function PlacedTrades() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    modes: [Mode.BUYER, Mode.SELLER, Mode.OWNER],
    mode: null,
    market: null,
    store: null,
    item: null,
    description: '',
    rate: null,
  });

  const response = useGetPlacedTradesQuery({ page, search });

  const links = [
    { label: 'My', to: '../my' },
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
