import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import {
  useGetAllLotsQuery,
  useGetMainLotsQuery,
  useGetMyLotsQuery,
  useGetPlacedLotsQuery,
} from '../../features/lots/lots.api';
import LotsTable from '../../features/lots/LotsTable';
import {
  createMyLotButton,
  createUserLotButton,
} from '../../features/lots/CreateLotModal';
import {
  buyMyLotAction,
  buyUserLotAction,
} from '../../features/lots/BuyLotModal';
import { completeLotAction } from '../../features/lots/CompleteLotModal';

export default function MyLots() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.SELLER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    storage: searchParams.get('storage'),
    cell: searchParams.get('cell'),
    item: searchParams.get('item'),
    description: searchParams.get('description') || '',
    minAmount: +(searchParams.get('minAmount') || 0) || null,
    maxAmount: +(searchParams.get('maxAmount') || 0) || null,
    minIntake: +(searchParams.get('minIntake') || 0) || null,
    maxIntake: +(searchParams.get('maxIntake') || 0) || null,
    kit: searchParams.get('kit'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    main: useGetMainLotsQuery,
    my: useGetMyLotsQuery,
    placed: useGetPlacedLotsQuery,
    all: useGetAllLotsQuery,
  }[tab]!({ page, search });

  const button = {
    main: createMyLotButton,
    my: createMyLotButton,
    all: createUserLotButton,
  }[tab];

  const actions = {
    main: [buyMyLotAction],
    my: [completeLotAction],
    all: [buyUserLotAction, completeLotAction],
  }[tab];

  return (
    <LotsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
      actions={actions}
    />
  );
}
