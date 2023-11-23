import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMainUsersQuery } from '../../features/users/users.api';
import UsersTable from '../../features/users/UsersTable';
import { Role } from '../../common/constants';

export default function MainUsers() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    roles: searchParams.get('roles')?.split(',') || [],
    city: searchParams.get('city'),
    type: searchParams.get('type'),
  });

  const response = useGetMainUsersQuery({ page, search });

  const links = [
    { label: t('pages.my'), to: 'my' },
    { label: t('pages.all'), to: 'all', role: Role.ADMIN },
  ];

  return (
    <UsersTable
      {...response}
      title={t('pages.main') + ' ' + t('navbar.users')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
