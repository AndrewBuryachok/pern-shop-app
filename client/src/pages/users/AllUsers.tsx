import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetAllUsersQuery } from '../../features/users/users.api';
import UsersTable from '../../features/users/UsersTable';
import { addUserRoleAction } from '../../features/users/AddUserRoleModal';
import { removeUserRoleAction } from '../../features/users/RemoveUserRoleModal';

export default function AllUsers() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetAllUsersQuery({ page, search: debounced });

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
