import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetAllLeasesQuery } from '../../features/leases/leases.api';
import LeasesTable from '../../features/leases/LeasesTable';

export default function AllLeases() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetAllLeasesQuery({ page, search: debounced });

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
