import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetRatingsUsersQuery } from '../../features/users/users.api';
import {
  useGetAllRatingsQuery,
  useGetMyRatingsQuery,
  useGetReceivedRatingsQuery,
} from '../../features/ratings/ratings.api';
import UsersTable from '../../features/users/UsersTable';
import RatingsTable from '../../features/ratings/RatingsTable';
import { createRatingButton } from '../../features/ratings/CreateRatingModal';
import { editRatingAction } from '../../features/ratings/EditRatingModal';
import { deleteRatingAction } from '../../features/ratings/DeleteRatingModal';

export default function RatingsPage() {
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
              modes: [Mode.SENDER, Mode.RECEIVER],
              mode: searchParams.get('mode') as Mode,
              rate: +(searchParams.get('rate') || 0) || null,
              minDate: searchParams.get('minDate'),
              maxDate: searchParams.get('maxDate'),
            },
      ),
    [tab],
  );

  const usersResponse = useGetRatingsUsersQuery(
    { page, search },
    { skip: tab !== 'top' },
  );

  const ratingsResponse = {
    top: useGetMyRatingsQuery,
    my: useGetMyRatingsQuery,
    received: useGetReceivedRatingsQuery,
    all: useGetAllRatingsQuery,
  }[tab]!({ page, search }, { skip: tab === 'top' });

  const button = { top: createRatingButton, my: createRatingButton }[tab];

  const actions = { my: [editRatingAction, deleteRatingAction] }[tab];

  return tab === 'top' ? (
    <UsersTable
      {...usersResponse}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
    />
  ) : (
    <RatingsTable
      {...ratingsResponse}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
      actions={actions}
    />
  );
}
