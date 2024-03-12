import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetIgnorersUsersQuery } from '../../features/users/users.api';
import {
  useGetMyIgnorersQuery,
  useGetReceivedIgnorersQuery,
} from '../../features/ignorers/ignorers.api';
import UsersTable from '../../features/users/UsersTable';
import { addIgnorerButton } from '../../features/ignorers/AddIgnorerModal';
import { removeIgnorerAction } from '../../features/ignorers/RemoveIgnorerModal';

export default function IgnorersPage() {
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
    top: useGetIgnorersUsersQuery,
    my: useGetMyIgnorersQuery,
    received: useGetReceivedIgnorersQuery,
  }[tab]!({ page, search });

  const button = {
    top: addIgnorerButton,
    my: addIgnorerButton,
    received: addIgnorerButton,
  }[tab];

  const actions = { my: [removeIgnorerAction] }[tab];

  return (
    <UsersTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
      actions={actions}
      column='ignorers'
      callback={(user) => user.ignorersCount!}
    />
  );
}
