import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllFriendsQuery } from '../../features/friends/friends.api';
import FriendsTable from '../../features/friends/FriendsTable';

export default function AllFriends() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    modes: [Mode.SENDER, Mode.RECEIVER],
    mode: null,
    type: null,
  });

  const response = useGetAllFriendsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  return (
    <FriendsTable
      {...response}
      title='All Friends'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
