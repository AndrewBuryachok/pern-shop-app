import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMyTradesQuery } from '../../features/trades/trades.api';
import TradesTable from '../../features/trades/TradesTable';
import { rateTradeAction } from '../../features/trades/RateTradeModal';
import { Role } from '../../common/constants';

export default function MyTrades() {
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

  const response = useGetMyTradesQuery({ page, search });

  const links = [
    { label: 'Placed', to: '../placed' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  const actions = [rateTradeAction];

  return (
    <TradesTable
      {...response}
      title='My Trades'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
