import { useLocation, useSearchParams } from 'react-router-dom';
import {
  useGetAllBoxesQuery,
  useGetMainBoxesQuery,
  useGetMyBoxesQuery,
} from '../../features/boxes/boxes.api';
import BoxesTable from '../../features/boxes/BoxesTable';
import {
  createMyBoxButton,
  createUserBoxButton,
} from '../../features/boxes/CreateBoxModal';

export default function BoxesPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    station: searchParams.get('station'),
    box: searchParams.get('box'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    completed: searchParams.get('completed'),
  };

  const response = {
    main: useGetMainBoxesQuery,
    my: useGetMyBoxesQuery,
    all: useGetAllBoxesQuery,
  }[tab]!(search);

  const button = {
    main: createMyBoxButton,
    my: createMyBoxButton,
    all: createUserBoxButton,
  }[tab];

  return <BoxesTable {...response} search={search} button={button} />;
}
