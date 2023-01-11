import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetAllCitiesQuery } from '../../features/cities/cities.api';
import CitiesTable from '../../features/cities/CitiesTable';

export default function AllCities() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetAllCitiesQuery({ page, search: debounced });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  return (
    <CitiesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Cities'
    />
  );
}
