import { useLocation, useSearchParams } from 'react-router-dom';
import {
  useGetAllStationsQuery,
  useGetMainStationsQuery,
  useGetMyStationsQuery,
} from '../../features/stations/stations.api';
import StationsTable from '../../features/stations/StationsTable';
import {
  createMyStationButton,
  createUserStationButton,
} from '../../features/stations/CreateStationModal';
import { editStationAction } from '../../features/stations/EditStationModal';

export default function StationsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    station: searchParams.get('station'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
  };

  const response = {
    main: useGetMainStationsQuery,
    my: useGetMyStationsQuery,
    all: useGetAllStationsQuery,
  }[tab]!(search);

  const button = {
    main: createMyStationButton,
    my: createMyStationButton,
    all: createUserStationButton,
  }[tab];

  const actions = { my: [editStationAction], all: [editStationAction] }[tab];

  return (
    <StationsTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
