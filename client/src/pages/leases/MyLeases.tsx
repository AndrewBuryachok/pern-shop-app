import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetMyLeasesQuery } from '../../features/leases/leases.api';
import LeasesTable from '../../features/leases/LeasesTable';
import { Role } from '../../common/constants';

export default function MyLeases() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    filters: [Filter.RENTER, Filter.OWNER].map((label) => ({
      label,
      value: true,
    })),
    mode: Mode.SOME,
    storage: null,
    cell: null,
  });

  const response = useGetMyLeasesQuery({ page, search });

  const links = [{ label: 'All', to: '../all', role: Role.MANAGER }];

  return (
    <LeasesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='My Leases'
    />
  );
}
