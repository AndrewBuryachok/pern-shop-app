import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMyTradesQuery } from '../../features/trades/trades.api';
import TradesTable from '../../features/trades/TradesTable';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyTrades() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: '',
    filters: ['Mode', 'Buyer', 'Seller', 'Owner'].map((label, index) => ({
      label,
      value: !!index,
    })),
    item: '',
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
