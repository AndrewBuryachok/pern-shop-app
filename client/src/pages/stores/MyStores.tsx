import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMyStoresQuery } from '../../features/stores/stores.api';
import StoresTable from '../../features/stores/StoresTable';
import { createMyStoreButton } from '../../features/stores/CreateStoreModal';
import { Role } from '../../common/constants';

export default function MyStores() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    market: searchParams.get('market'),
    store: searchParams.get('store'),
    name: searchParams.get('name') || '',
  });

  const response = useGetMyStoresQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  const button = createMyStoreButton;

  return (
    <StoresTable
      {...response}
      title='My Stores'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
    />
  );
}
