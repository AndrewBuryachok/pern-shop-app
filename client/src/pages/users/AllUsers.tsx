import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetAllUsersQuery } from '../../features/users/users.api';
import UsersTable from '../../features/users/UsersTable';
import { editUserPasswordAction } from '../../features/users/EditUserPasswordModal';
import { addUserRoleAction } from '../../features/users/AddUserRoleModal';
import { removeUserRoleAction } from '../../features/users/RemoveUserRoleModal';

export default function AllUsers() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    roles: searchParams.get('roles')?.split(',') || [],
    city: searchParams.get('city'),
    type: searchParams.get('type'),
    name: searchParams.get('name') || '',
    users: true,
  });

  const response = useGetAllUsersQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  const actions = [
    editUserPasswordAction,
    addUserRoleAction,
    removeUserRoleAction,
  ];

  return (
    <UsersTable
      {...response}
      title='All Users'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
