import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllLeasesQuery } from '../../features/leases/leases.api';
import LeasesTable from '../../features/leases/LeasesTable';

export default function AllLeases() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    modes: [Mode.RENTER, Mode.OWNER],
    mode: null,
    storage: null,
    cell: null,
  });

  const response = useGetAllLeasesQuery({ page, search });

  const links = [{ label: 'My', to: '../my' }];

  return (
    <LeasesTable
      {...response}
      title='All Leases'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
