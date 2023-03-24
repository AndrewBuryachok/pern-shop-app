import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllUsersQuery } from '../../features/users/users.api';
import UsersTable from '../../features/users/UsersTable';
import { addUserRoleAction } from '../../features/users/AddUserRoleModal';
import { removeUserRoleAction } from '../../features/users/RemoveUserRoleModal';

export default function AllUsers() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({ user: '', name: '' });

  const response = useGetAllUsersQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  const actions = [addUserRoleAction, removeUserRoleAction];

  return (
    <UsersTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Users'
      actions={actions}
    />
  );
}
