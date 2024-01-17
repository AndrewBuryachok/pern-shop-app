import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import {
  useGetAllStoresQuery,
  useGetMainStoresQuery,
  useGetMyStoresQuery,
} from '../../features/stores/stores.api';
import StoresTable from '../../features/stores/StoresTable';
import {
  createMyStoreButton,
  createUserStoreButton,
} from '../../features/stores/CreateStoreModal';
import {
  reserveMyStoreAction,
  reserveUserStoreAction,
} from '../../features/stores/ReserveStoreModal';

export default function MyStores() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    market: searchParams.get('market'),
    store: searchParams.get('store'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
  });

  const response = {
    main: useGetMainStoresQuery,
    my: useGetMyStoresQuery,
    all: useGetAllStoresQuery,
  }[tab]!({ page, search });

  const button = {
    main: createMyStoreButton,
    my: createMyStoreButton,
    all: createUserStoreButton,
  }[tab];

  const actions = {
    main: [reserveMyStoreAction],
    all: [reserveUserStoreAction],
  }[tab];

  return (
    <StoresTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
      actions={actions}
    />
  );
}
