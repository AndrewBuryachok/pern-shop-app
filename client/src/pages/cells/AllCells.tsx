import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetAllCellsQuery } from '../../features/cells/cells.api';
import CellsTable from '../../features/cells/CellsTable';

export default function AllCells() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetAllCellsQuery({ page, search: debounced });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  return (
    <CellsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Cells'
    />
  );
}
