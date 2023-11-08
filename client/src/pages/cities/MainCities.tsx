import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMainCitiesQuery } from '../../features/cities/cities.api';
import CitiesTable from '../../features/cities/CitiesTable';
import { Role } from '../../common/constants';

export default function MainCities() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    city: searchParams.get('city'),
    name: searchParams.get('name') || '',
  });

  const response = useGetMainCitiesQuery({ page, search });

  const links = [
    { label: t('pages.my'), to: 'my' },
    { label: t('pages.all'), to: 'all', role: Role.ADMIN },
  ];

  return (
    <CitiesTable
      {...response}
      title={t('pages.main') + ' ' + t('navbar.cities')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
