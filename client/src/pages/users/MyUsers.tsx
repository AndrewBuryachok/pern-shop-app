import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMyUsersQuery } from '../../features/users/users.api';
import UsersTable from '../../features/users/UsersTable';
import { addCityUserButton } from '../../features/users/AddCityUserModal';
import { removeCityUserAction } from '../../features/users/RemoveCityUserModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyUsers() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({ user: '', name: '' });

  const response = useGetMyUsersQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.ADMIN) },
  ];

  const button = addCityUserButton;

  const actions = [removeCityUserAction];

  return (
    <UsersTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      title='My Users'
      actions={actions}
    />
  );
}
