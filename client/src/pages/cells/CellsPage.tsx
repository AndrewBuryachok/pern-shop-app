import { useLocation, useSearchParams } from 'react-router-dom';
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
import {
  reserveMyCellAction,
  reserveUserCellAction,
} from '../../features/cells/ReserveCellModal';

export default function CellsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    storage: searchParams.get('storage'),
    storageTag: searchParams.get('storageTag'),
    cell: searchParams.get('cell'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
  };

  const response = {
    main: useGetMainCellsQuery,
    my: useGetMyCellsQuery,
    all: useGetAllCellsQuery,
  }[tab]!(search);

  const button = {
    main: createMyCellButton,
    my: createMyCellButton,
    all: createUserCellButton,
  }[tab];

  const actions = {
    main: [reserveMyCellAction],
    all: [reserveUserCellAction],
  }[tab];

  return (
    <CellsTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
