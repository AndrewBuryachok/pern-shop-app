import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetAllStoresQuery } from '../../features/stores/stores.api';
import StoresTable from '../../features/stores/StoresTable';

export default function AllStores() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetAllStoresQuery({ page, search: debounced });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  return (
    <StoresTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Stores'
    />
  );
}
