import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import {
  useGetAllFriendsQuery,
  useGetMainFriendsQuery,
  useGetMyFriendsQuery,
} from '../../features/friends/friends.api';
import FriendsTable from '../../features/friends/FriendsTable';
import { createFriendButton } from '../../features/friends/CreateFriendModal';
import { addFriendAction } from '../../features/friends/AddFriendModal';
import { removeFriendAction } from '../../features/friends/RemoveFriendModal';

export default function MyFriends() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    modes: [Mode.SENDER, Mode.RECEIVER],
    mode: searchParams.get('mode') as Mode,
    type: searchParams.get('type'),
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    main: useGetMainFriendsQuery,
    my: useGetMyFriendsQuery,
    all: useGetAllFriendsQuery,
  }[tab]!({ page, search });

  const button = { my: createFriendButton }[tab];

  const actions = { my: [addFriendAction, removeFriendAction] }[tab];

  return (
    <FriendsTable
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
