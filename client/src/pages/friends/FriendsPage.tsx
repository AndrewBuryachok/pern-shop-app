import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetFriendsUsersQuery } from '../../features/users/users.api';
import {
  useGetMyFriendsQuery,
  useGetReceivedFriendsQuery,
  useGetSentFriendsQuery,
} from '../../features/friends/friends.api';
import UsersTable from '../../features/users/UsersTable';
import { createFriendButton } from '../../features/friends/CreateFriendModal';
import { addFriendAction } from '../../features/friends/AddFriendModal';
import { removeFriendAction } from '../../features/friends/RemoveFriendModal';

export default function FriendsPage() {
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
    top: useGetFriendsUsersQuery,
    my: useGetMyFriendsQuery,
    sent: useGetSentFriendsQuery,
    received: useGetReceivedFriendsQuery,
  }[tab]!({ page, search });

  const button = {
    top: createFriendButton,
    my: createFriendButton,
    sent: createFriendButton,
    received: createFriendButton,
  }[tab];

  const actions = {
    my: [removeFriendAction],
    sent: [removeFriendAction],
    received: [addFriendAction, removeFriendAction],
  }[tab];

  return (
    <UsersTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
      actions={actions}
      column='friends'
      callback={(user) => user.friendsCount!}
    />
  );
}
