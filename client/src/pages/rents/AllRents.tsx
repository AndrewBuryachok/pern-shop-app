import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetAllRentsQuery } from '../../features/rents/rents.api';
import RentsTable from '../../features/rents/RentsTable';

export default function AllRents() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetAllRentsQuery({ page, search: debounced });

  const links = [{ label: 'My', to: '../my' }];

  return (
    <RentsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Rents'
    />
  );
}
