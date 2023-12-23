import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import {
  useGetMyFriendsQuery,
  useGetReceivedFriendsQuery,
} from '../../features/friends/friends.api';
import UsersTable from '../../features/users/UsersTable';
import { addFriendButton } from '../../features/friends/AddFriendModal';
import { removeFriendAction } from '../../features/friends/RemoveFriendModal';

export default function MyFriends() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    roles: searchParams.get('roles')?.split(',') || [],
    city: searchParams.get('city'),
    type: searchParams.get('type'),
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    my: useGetMyFriendsQuery,
    received: useGetReceivedFriendsQuery,
  }[tab]!({ page, search });

  const button = { my: addFriendButton }[tab];

  const actions = { my: [removeFriendAction] }[tab];

  return (
    <UsersTable
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
