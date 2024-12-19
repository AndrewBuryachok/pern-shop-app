import { useLocation, useSearchParams } from 'react-router-dom';
import {
  useGetAllStallsQuery,
  useGetMainStallsQuery,
  useGetMyStallsQuery,
} from '../../features/stalls/stalls.api';
import StallsTable from '../../features/stalls/StallsTable';
import {
  createMyStallButton,
  createUserStallButton,
} from '../../features/stalls/CreateStallModal';
import {
  reserveMyStallAction,
  reserveUserStallAction,
} from '../../features/stalls/ReserveStallModal';

export default function StallsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    market: searchParams.get('market'),
    marketTag: searchParams.get('marketTag'),
    stall: searchParams.get('stall'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    completed: searchParams.get('completed'),
  };

  const response = {
    main: useGetMainStallsQuery,
    my: useGetMyStallsQuery,
    all: useGetAllStallsQuery,
  }[tab]!(search);

  const button = {
    main: createMyStallButton,
    my: createMyStallButton,
    all: createUserStallButton,
  }[tab];

  const actions = {
    main: [reserveMyStallAction],
    all: [reserveUserStallAction],
  }[tab];

  return (
    <StallsTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
