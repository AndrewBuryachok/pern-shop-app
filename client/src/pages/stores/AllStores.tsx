import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllStoresQuery } from '../../features/stores/stores.api';
import StoresTable from '../../features/stores/StoresTable';
import { createUserStoreButton } from '../../features/stores/CreateStoreModal';
import { reserveUserStoreAction } from '../../features/stores/ReserveStoreModal';

export default function AllStores() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    market: null,
    store: null,
    name: '',
  });

  const response = useGetAllStoresQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  const button = createUserStoreButton;

  const actions = [reserveUserStoreAction];

  return (
    <StoresTable
      {...response}
      title='All Stores'
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
