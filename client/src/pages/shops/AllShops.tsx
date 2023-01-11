import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetAllShopsQuery } from '../../features/shops/shops.api';
import ShopsTable from '../../features/shops/ShopsTable';

export default function AllShops() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetAllShopsQuery({ page, search: debounced });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  return (
    <ShopsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Shops'
    />
  );
}
