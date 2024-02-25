import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetCardsUsersQuery } from '../../features/users/users.api';
import {
  useGetAllCardsQuery,
  useGetMyCardsQuery,
} from '../../features/cards/cards.api';
import UsersTable from '../../features/users/UsersTable';
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

  const [search, setSearch] = useState<ISearch>({});

  useEffect(
    () =>
      setSearch(
        tab === 'top'
          ? {
              id: +(searchParams.get('id') || 0) || null,
              user: searchParams.get('user'),
              roles: searchParams.get('roles')?.split(',') || [],
              city: searchParams.get('city'),
              type: searchParams.get('type'),
              minDate: searchParams.get('minDate'),
              maxDate: searchParams.get('maxDate'),
            }
          : {
              id: +(searchParams.get('id') || 0) || null,
              user: searchParams.get('user'),
              card: searchParams.get('card'),
            },
      ),
    [tab],
  );

  const usersResponse = useGetCardsUsersQuery(
    { page, search },
    { skip: tab !== 'top' },
  );

  const cardsResponse = {
    top: useGetMyCardsQuery,
    my: useGetMyCardsQuery,
    all: useGetAllCardsQuery,
  }[tab]!({ page, search }, { skip: tab === 'top' });

  const button = {
    top: createMyCardButton,
    my: createMyCardButton,
    all: createUserCardButton,
  }[tab];

  const actions = {
    my: [editMyCardAction, addMyCardUserAction, removeMyCardUserAction],
    all: [editUserCardAction, addUserCardUserAction, removeUserCardUserAction],
  }[tab];

  return tab === 'top' ? (
    <UsersTable
      {...usersResponse}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
      column='balance'
      callback={(user) => user.cardsCount!}
    />
  ) : (
    <CardsTable
      {...cardsResponse}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
      actions={actions}
    />
  );
}
