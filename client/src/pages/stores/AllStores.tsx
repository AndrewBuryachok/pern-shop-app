import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetAllStoresQuery } from '../../features/stores/stores.api';
import StoresTable from '../../features/stores/StoresTable';
import { createUserStoreButton } from '../../features/stores/CreateStoreModal';
import { reserveUserStoreAction } from '../../features/stores/ReserveStoreModal';

export default function AllStores() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    market: searchParams.get('market'),
    store: searchParams.get('store'),
    name: searchParams.get('name') || '',
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
