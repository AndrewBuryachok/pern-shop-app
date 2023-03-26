import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllCellsQuery } from '../../features/cells/cells.api';
import CellsTable from '../../features/cells/CellsTable';

export default function AllCells() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: '',
    card: '',
    storage: '',
    cell: '',
    name: '',
  });

  const response = useGetAllCellsQuery({ page, search });

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
