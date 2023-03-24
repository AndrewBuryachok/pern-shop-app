import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllLeasesQuery } from '../../features/leases/leases.api';
import LeasesTable from '../../features/leases/LeasesTable';

export default function AllLeases() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: '',
    filters: ['Mode', 'Renter', 'Lessor'].map((label, index) => ({
      label,
      value: !!index,
    })),
  });

  const response = useGetAllLeasesQuery({ page, search });

  const links = [{ label: 'My', to: '../my' }];

  return (
    <LeasesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Leases'
    />
  );
}
