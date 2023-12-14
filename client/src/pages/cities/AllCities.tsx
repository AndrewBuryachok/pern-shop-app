import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetAllCitiesQuery } from '../../features/cities/cities.api';
import CitiesTable from '../../features/cities/CitiesTable';
import { createUserCityButton } from '../../features/cities/CreateCityModal';
import { editUserCityAction } from '../../features/cities/EditCityModal';
import { addUserCityUserAction } from '../../features/cities/AddCityUserModal';
import { removeUserCityUserAction } from '../../features/cities/RemoveCityUserModal';

export default function AllCities() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    city: searchParams.get('city'),
  });

  const response = useGetAllCitiesQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.my'), to: '../my' },
  ];

  const button = createUserCityButton;

  const actions = [
    editUserCityAction,
    addUserCityUserAction,
    removeUserCityUserAction,
  ];

  return (
    <CitiesTable
      {...response}
      title={t('pages.all') + ' ' + t('navbar.cities')}
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
