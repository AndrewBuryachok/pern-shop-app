import { useLocation, useSearchParams } from 'react-router-dom';
import {
  useGetAllDrawersQuery,
  useGetMainDrawersQuery,
  useGetMyDrawersQuery,
} from '../../features/drawers/drawers.api';
import DrawersTable from '../../features/drawers/DrawersTable';
import {
  createMyDrawerButton,
  createUserDrawerButton,
} from '../../features/drawers/CreateDrawerModal';

export default function DrawersPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    station: searchParams.get('station'),
    drawer: searchParams.get('drawer'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
  };

  const response = {
    main: useGetMainDrawersQuery,
    my: useGetMyDrawersQuery,
    all: useGetAllDrawersQuery,
  }[tab]!(search);

  const button = {
    main: createMyDrawerButton,
    my: createMyDrawerButton,
    all: createUserDrawerButton,
  }[tab];

  return <DrawersTable {...response} search={search} button={button} />;
}
