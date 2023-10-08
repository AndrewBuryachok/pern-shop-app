import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMainStoresQuery } from '../../features/stores/stores.api';
import StoresTable from '../../features/stores/StoresTable';
import { reserveMyStoreAction } from '../../features/stores/ReserveStoreModal';
import { Role } from '../../common/constants';

export default function MainStores() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    market: searchParams.get('market'),
    store: searchParams.get('store'),
    name: searchParams.get('name') || '',
  });

  const response = useGetMainStoresQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'All', to: 'all', role: Role.MANAGER },
  ];

  const actions = [reserveMyStoreAction];

  return (
    <StoresTable
      {...response}
      title='Main Stores'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
