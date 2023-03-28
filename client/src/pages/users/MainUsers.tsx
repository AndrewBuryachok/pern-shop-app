import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMainUsersQuery } from '../../features/users/users.api';
import UsersTable from '../../features/users/UsersTable';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MainUsers() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    mode: 'false',
    filters: ['User', 'Owner'].map((label) => ({
      label,
      value: true,
    })),
    city: null,
    name: '',
    users: true,
  });

  const response = useGetMainUsersQuery({ page, search });

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
