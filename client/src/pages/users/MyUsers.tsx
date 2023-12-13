import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMyUsersQuery } from '../../features/users/users.api';
import UsersTable from '../../features/users/UsersTable';
import { addUserCityButton } from '../../features/users/AddUserCityModal';
import { removeUserCityAction } from '../../features/users/RemoveUserCityModal';
import { Role } from '../../common/constants';

export default function MyUsers() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    roles: searchParams.get('roles')?.split(',') || [],
    city: searchParams.get('city'),
    type: searchParams.get('type'),
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = useGetMyUsersQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.all'), to: '../all', role: Role.ADMIN },
  ];

  const button = addUserCityButton;

  const actions = [removeUserCityAction];

  return (
    <UsersTable
      {...response}
      title={t('pages.my') + ' ' + t('navbar.users')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      actions={actions}
    />
  );
}
