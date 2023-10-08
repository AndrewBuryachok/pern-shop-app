import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMainUsersQuery } from '../../features/users/users.api';
import UsersTable from '../../features/users/UsersTable';
import { Role } from '../../common/constants';

export default function MainUsers() {
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

  const response = useGetMainUsersQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'All', to: 'all', role: Role.ADMIN },
  ];

  return (
    <UsersTable
      {...response}
      title='Main Users'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
