import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllTradesQuery } from '../../features/trades/trades.api';
import TradesTable from '../../features/trades/TradesTable';

export default function AllTrades() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: '',
    card: '',
    mode: 'false',
    filters: ['Buyer', 'Seller', 'Owner'].map((label) => ({
      label,
      value: true,
    })),
    market: '',
    store: '',
    item: '',
    description: '',
  });

  const response = useGetAllTradesQuery({ page, search });

  const links = [{ label: 'My', to: '../my' }];

  return (
    <TradesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Trades'
    />
  );
}
