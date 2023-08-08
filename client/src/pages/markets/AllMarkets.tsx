import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllMarketsQuery } from '../../features/markets/markets.api';
import MarketsTable from '../../features/markets/MarketsTable';
import { createUserMarketButton } from '../../features/markets/CreateMarketModal';
import { editMarketAction } from '../../features/markets/EditMarketModal';

export default function AllMarkets() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    market: null,
    name: '',
  });

  const response = useGetAllMarketsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  const button = createUserMarketButton;

  const actions = [editMarketAction];

  return (
    <MarketsTable
      {...response}
      title='All Markets'
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
