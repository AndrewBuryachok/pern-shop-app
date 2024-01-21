import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import {
  useGetAllWaresQuery,
  useGetMainWaresQuery,
  useGetMyWaresQuery,
  useGetPlacedWaresQuery,
} from '../../features/wares/wares.api';
import WaresTable from '../../features/wares/WaresTable';
import {
  createMyWareButton,
  createUserWareButton,
} from '../../features/wares/CreateWareModal';
import { editWareAction } from '../../features/wares/EditWareModal';
import {
  buyMyWareAction,
  buyUserWareAction,
} from '../../features/wares/BuyWareModal';
import { completeWareAction } from '../../features/wares/CompleteWareModal';

export default function MyWares() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.SELLER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    market: searchParams.get('market'),
    store: searchParams.get('store'),
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
    main: useGetMainWaresQuery,
    my: useGetMyWaresQuery,
    placed: useGetPlacedWaresQuery,
    all: useGetAllWaresQuery,
  }[tab]!({ page, search });

  const button = {
    main: createMyWareButton,
    my: createMyWareButton,
    all: createUserWareButton,
  }[tab];

  const actions = {
    main: [buyMyWareAction],
    my: [editWareAction, completeWareAction],
    all: [editWareAction, buyUserWareAction, completeWareAction],
  }[tab];

  return (
    <WaresTable
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
