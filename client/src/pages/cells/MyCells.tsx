import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMyCellsQuery } from '../../features/cells/cells.api';
import CellsTable from '../../features/cells/CellsTable';
import { createCellButton } from '../../features/cells/CreateCellModal';
import { Role } from '../../common/constants';

export default function MyCells() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    storage: null,
    cell: null,
    name: '',
  });

  const response = useGetMyCellsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', role: Role.MANAGER },
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
