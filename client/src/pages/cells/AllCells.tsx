import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllCellsQuery } from '../../features/cells/cells.api';
import CellsTable from '../../features/cells/CellsTable';
import { createUserCellButton } from '../../features/cells/CreateCellModal';

export default function AllCells() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    storage: null,
    cell: null,
    name: '',
  });

  const response = useGetAllCellsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  const button = createUserCellButton;

  return (
    <CellsTable
      {...response}
      title='All Cells'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
    />
  );
}
