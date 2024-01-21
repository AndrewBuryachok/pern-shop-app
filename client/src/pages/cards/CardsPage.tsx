import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import {
  useGetAllCardsQuery,
  useGetMyCardsQuery,
} from '../../features/cards/cards.api';
import CardsTable from '../../features/cards/CardsTable';
import {
  createMyCardButton,
  createUserCardButton,
} from '../../features/cards/CreateCardModal';
import {
  editMyCardAction,
  editUserCardAction,
} from '../../features/cards/EditCardModal';
import {
  addMyCardUserAction,
  addUserCardUserAction,
} from '../../features/cards/AddCardUserModal';
import {
  removeMyCardUserAction,
  removeUserCardUserAction,
} from '../../features/cards/RemoveCardUserModal';

export default function CardsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
  });

  const response = {
    my: useGetMyCardsQuery,
    all: useGetAllCardsQuery,
  }[tab]!({ page, search });

  const button = { my: createMyCardButton, all: createUserCardButton }[tab];

  const actions = {
    my: [editMyCardAction, addMyCardUserAction, removeMyCardUserAction],
    all: [editUserCardAction, addUserCardUserAction, removeUserCardUserAction],
  }[tab];

  return (
    <CardsTable
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
