import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetMainUsersQuery } from '../../features/users/users.api';
import UsersTable from '../../features/users/UsersTable';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MainUsers() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetMainUsersQuery({ page, search: debounced });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'All', to: 'all', disabled: isUserNotHasRole(Role.ADMIN) },
  ];

  return (
    <UsersTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='Main Users'
    />
  );
}
