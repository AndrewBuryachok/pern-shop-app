import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetAllCitiesQuery } from '../../features/cities/cities.api';
import CitiesTable from '../../features/cities/CitiesTable';
import { createUserCityButton } from '../../features/cities/CreateCityModal';
import { editUserCityAction } from '../../features/cities/EditCityModal';
import { addUserCityUserAction } from '../../features/cities/AddCityUserModal';
import { removeUserCityUserAction } from '../../features/cities/RemoveCityUserModal';

export default function AllCities() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    city: searchParams.get('city'),
    name: searchParams.get('name') || '',
  });

  const response = useGetAllCitiesQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
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
      title='All Cities'
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
