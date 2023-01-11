import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetMyCellsQuery } from '../../features/cells/cells.api';
import CellsTable from '../../features/cells/CellsTable';
import { createCellButton } from '../../features/cells/CreateCellModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyCells() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetMyCellsQuery({ page, search: debounced });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.MANAGER) },
  ];

  const button = createCellButton;

  return (
    <CellsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      title='My Cells'
    />
  );
}
