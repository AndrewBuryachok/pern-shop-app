import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetMyTradesQuery } from '../../features/trades/trades.api';
import TradesTable from '../../features/trades/TradesTable';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyTrades() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetMyTradesQuery({ page, search: debounced });

  const links = [
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.MANAGER) },
  ];

  return (
    <TradesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='My Trades'
    />
  );
}
