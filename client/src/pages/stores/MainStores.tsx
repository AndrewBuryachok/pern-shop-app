import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMainStoresQuery } from '../../features/stores/stores.api';
import StoresTable from '../../features/stores/StoresTable';
import { reserveStoreAction } from '../../features/stores/ReserveStoreModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MainStores() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({ user: '', name: '' });

  const response = useGetMainStoresQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'All', to: 'all', disabled: isUserNotHasRole(Role.MANAGER) },
  ];

  const actions = [reserveStoreAction];

  return (
    <StoresTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='Main Stores'
      actions={actions}
    />
  );
}
