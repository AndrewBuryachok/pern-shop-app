import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import {
  useGetAllLeasesQuery,
  useGetMainLeasesQuery,
  useGetMyLeasesQuery,
  useGetReceivedLeasesQuery,
} from '../../features/leases/leases.api';
import LeasesTable from '../../features/leases/LeasesTable';
import { completeLeaseAction } from '../../features/leases/CompleteLeaseModal';

export default function MyLeases() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.RENTER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    storage: searchParams.get('storage'),
    cell: searchParams.get('cell'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    kind: searchParams.get('kind'),
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    main: useGetMainLeasesQuery,
    my: useGetMyLeasesQuery,
    received: useGetReceivedLeasesQuery,
    all: useGetAllLeasesQuery,
  }[tab]!({ page, search });

  const actions = {
    my: [completeLeaseAction],
    all: [completeLeaseAction],
  }[tab];

  return (
    <LeasesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      actions={actions}
    />
  );
}
