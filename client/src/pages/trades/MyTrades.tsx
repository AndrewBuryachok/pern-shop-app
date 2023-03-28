import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetMyTradesQuery } from '../../features/trades/trades.api';
import TradesTable from '../../features/trades/TradesTable';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyTrades() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    filters: [Filter.BUYER, Filter.SELLER, Filter.OWNER].map((label) => ({
      label,
      value: true,
    })),
    mode: Mode.SOME,
    market: null,
    store: null,
    item: null,
    description: '',
  });

  const response = useGetMyTradesQuery({ page, search });

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
