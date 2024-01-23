import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import {
  useGetAllUsersQuery,
  useGetMainUsersQuery,
  useGetMyUsersQuery,
} from '../../features/users/users.api';
import UsersTable from '../../features/users/UsersTable';
import { addUserCityButton } from '../../features/users/AddUserCityModal';
import { removeUserCityAction } from '../../features/users/RemoveUserCityModal';
import { editUserPasswordAction } from '../../features/users/EditUserPasswordModal';
import { addUserRoleAction } from '../../features/users/AddUserRoleModal';
import { removeUserRoleAction } from '../../features/users/RemoveUserRoleModal';

export default function UsersPage() {
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
    main: useGetMainUsersQuery,
    my: useGetMyUsersQuery,
    all: useGetAllUsersQuery,
  }[tab]!({ page, search });

  const button = { my: addUserCityButton }[tab];

  const actions = {
    my: [removeUserCityAction],
    all: [editUserPasswordAction, addUserRoleAction, removeUserRoleAction],
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
    />
  );
}
