import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import {
  useGetMyFollowingsQuery,
  useGetReceivedFollowingsQuery,
} from '../../features/followings/followings.api';
import UsersTable from '../../features/users/UsersTable';
import { addFollowingButton } from '../../features/followings/AddFollowingModal';
import { removeFollowingAction } from '../../features/followings/RemoveFollowingModal';

export default function MyFollowings() {
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
    my: useGetMyFollowingsQuery,
    received: useGetReceivedFollowingsQuery,
  }[tab]!({ page, search });

  const button = { my: addFollowingButton }[tab];

  const actions = { my: [removeFollowingAction] }[tab];

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
