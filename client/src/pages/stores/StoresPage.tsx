import { useLocation, useSearchParams } from 'react-router-dom';
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

export default function StoresPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    market: searchParams.get('market'),
    marketTag: searchParams.get('marketTag'),
    store: searchParams.get('store'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    completed: searchParams.get('completed'),
  };

  const response = {
    main: useGetMainStoresQuery,
    my: useGetMyStoresQuery,
    all: useGetAllStoresQuery,
  }[tab]!(search);

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
      search={search}
      button={button}
      actions={actions}
    />
  );
}
