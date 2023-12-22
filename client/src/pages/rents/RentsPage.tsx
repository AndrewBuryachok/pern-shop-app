import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import {
  useGetAllRentsQuery,
  useGetMyRentsQuery,
  useGetPlacedRentsQuery,
} from '../../features/rents/rents.api';
import RentsTable from '../../features/rents/RentsTable';
import { completeRentAction } from '../../features/rents/CompleteRentModal';

export default function MyRents() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.RENTER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    market: searchParams.get('market'),
    store: searchParams.get('store'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    my: useGetMyRentsQuery,
    placed: useGetPlacedRentsQuery,
    all: useGetAllRentsQuery,
  }[tab]!({ page, search });

  const actions = { my: [completeRentAction], all: [completeRentAction] }[tab];

  return (
    <RentsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      actions={actions}
    />
  );
}
