import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMyMarketsQuery } from '../../features/markets/markets.api';
import MarketsTable from '../../features/markets/MarketsTable';
import { createMarketButton } from '../../features/markets/CreateMarketModal';
import { editMarketAction } from '../../features/markets/EditMarketModal';
import { createStoreAction } from '../../features/stores/CreateStoreModal';
import { Role } from '../../common/constants';

export default function MyMarkets() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    market: null,
    name: '',
  });

  const response = useGetMyMarketsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  const button = createMarketButton;

  const actions = [editMarketAction, createStoreAction];

  return (
    <MarketsTable
      {...response}
      title='My Markets'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      actions={actions}
    />
  );
}
