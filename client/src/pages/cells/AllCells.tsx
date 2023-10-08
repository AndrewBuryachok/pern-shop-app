import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetAllCellsQuery } from '../../features/cells/cells.api';
import CellsTable from '../../features/cells/CellsTable';
import { createUserCellButton } from '../../features/cells/CreateCellModal';

export default function AllCells() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    storage: searchParams.get('storage'),
    cell: searchParams.get('cell'),
    name: searchParams.get('name') || '',
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
