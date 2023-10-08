import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMainFriendsQuery } from '../../features/friends/friends.api';
import FriendsTable from '../../features/friends/FriendsTable';
import { Role } from '../../common/constants';

export default function MainFriends() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    modes: [Mode.SENDER, Mode.RECEIVER],
    mode: null,
    type: null,
  });

  const response = useGetMainFriendsQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'All', to: 'all', role: Role.ADMIN },
  ];

  return (
    <FriendsTable
      {...response}
      title='Main Friends'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
