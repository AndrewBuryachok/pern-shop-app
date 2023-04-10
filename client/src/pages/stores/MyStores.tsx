import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMyStoresQuery } from '../../features/stores/stores.api';
import StoresTable from '../../features/stores/StoresTable';
import { createStoreButton } from '../../features/stores/CreateStoreModal';
import { Role } from '../../common/constants';

export default function MyStores() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    market: null,
    store: null,
    name: '',
  });

  const response = useGetMyStoresQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  const button = createStoreButton;

  return (
    <StoresTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      title='My Stores'
    />
  );
}
