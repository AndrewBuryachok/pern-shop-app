import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMainStoresQuery } from '../../features/stores/stores.api';
import StoresTable from '../../features/stores/StoresTable';
import { reserveStoreAction } from '../../features/stores/ReserveStoreModal';
import { Role } from '../../common/constants';

export default function MainStores() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    market: null,
    store: null,
    name: '',
  });

  const response = useGetMainStoresQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'All', to: 'all', role: Role.MANAGER },
  ];

  const actions = [reserveStoreAction];

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
