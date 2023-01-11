import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetAllWaresQuery } from '../../features/wares/wares.api';
import WaresTable from '../../features/wares/WaresTable';

export default function AllWares() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetAllWaresQuery({ page, search: debounced });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
    { label: 'Placed', to: '../placed' },
  ];

  return (
    <WaresTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Wares'
    />
  );
}
