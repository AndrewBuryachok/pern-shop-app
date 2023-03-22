import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetAllTradesQuery } from '../../features/trades/trades.api';
import TradesTable from '../../features/trades/TradesTable';

export default function AllTrades() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetAllTradesQuery({ page, search: debounced });

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
