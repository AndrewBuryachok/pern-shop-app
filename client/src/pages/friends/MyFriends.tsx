import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetMyFriendsQuery } from '../../features/friends/friends.api';
import FriendsTable from '../../features/friends/FriendsTable';
import { createFriendButton } from '../../features/friends/CreateFriendModal';
import { addFriendAction } from '../../features/friends/AddFriendModal';
import { removeFriendAction } from '../../features/friends/RemoveFriendModal';
import { Role } from '../../common/constants';

export default function MyFriends() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    filters: [Filter.SENDER, Filter.RECEIVER].map((label) => ({
      label,
      value: true,
    })),
    mode: Mode.SOME,
    type: null,
  });

  const response = useGetMyFriendsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', role: Role.ADMIN },
  ];

  const button = createFriendButton;

  const actions = [addFriendAction, removeFriendAction];

  return (
    <FriendsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      actions={actions}
      title='My Friends'
    />
  );
}
