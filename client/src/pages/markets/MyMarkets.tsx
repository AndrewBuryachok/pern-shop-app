import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMyMarketsQuery } from '../../features/markets/markets.api';
import MarketsTable from '../../features/markets/MarketsTable';
import { createMarketButton } from '../../features/markets/CreateMarketModal';
import { editMarketAction } from '../../features/markets/EditMarketModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyMarkets() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({ user: '', name: '' });

  const response = useGetMyMarketsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.MANAGER) },
  ];

  const button = createMarketButton;

  const actions = [editMarketAction];

  return (
    <MarketsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      title='My Markets'
      actions={actions}
    />
  );
}
