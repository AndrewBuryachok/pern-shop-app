import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import {
  useGetAllCellsQuery,
  useGetMainCellsQuery,
  useGetMyCellsQuery,
} from '../../features/cells/cells.api';
import CellsTable from '../../features/cells/CellsTable';
import {
  createMyCellButton,
  createUserCellButton,
} from '../../features/cells/CreateCellModal';

export default function MyCells() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    storage: searchParams.get('storage'),
    cell: searchParams.get('cell'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
  });

  const response = {
    main: useGetMainCellsQuery,
    my: useGetMyCellsQuery,
    all: useGetAllCellsQuery,
  }[tab]!({ page, search });

  const button = { my: createMyCellButton, all: createUserCellButton }[tab];

  return (
    <CellsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
    />
  );
}
