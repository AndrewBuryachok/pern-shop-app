import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllTradesQuery } from '../../features/trades/trades.api';
import TradesTable from '../../features/trades/TradesTable';
import { rateTradeAction } from '../../features/trades/RateTradeModal';

export default function AllTrades() {
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

  const response = useGetAllTradesQuery({ page, search });

  const links = [
    { label: 'My', to: '../my' },
    { label: 'Placed', to: '../placed' },
  ];

  const actions = [rateTradeAction];

  return (
    <TradesTable
      {...response}
      title='All Trades'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
