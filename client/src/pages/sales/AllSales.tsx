import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetAllSalesQuery } from '../../features/sales/sales.api';
import SalesTable from '../../features/sales/SalesTable';

export default function AllSales() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetAllSalesQuery({ page, search: debounced });

  const links = [
    { label: 'My', to: '../my' },
    { label: 'Placed', to: '../placed' },
  ];

  return (
    <SalesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Sales'
    />
  );
}
