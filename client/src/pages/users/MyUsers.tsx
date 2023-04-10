import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMyUsersQuery } from '../../features/users/users.api';
import UsersTable from '../../features/users/UsersTable';
import { addUserCityButton } from '../../features/users/AddUserCityModal';
import { removeUserCityAction } from '../../features/users/RemoveUserCityModal';
import { Role } from '../../common/constants';

export default function MyUsers() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    roles: [],
    mode: Mode.SOME,
    city: null,
    name: '',
    users: true,
  });

  const response = useGetMyUsersQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', role: Role.ADMIN },
  ];

  const button = addUserCityButton;

  const actions = [removeUserCityAction];

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
