import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllCitiesQuery } from '../../features/cities/cities.api';
import CitiesTable from '../../features/cities/CitiesTable';
import { createUserCityButton } from '../../features/cities/CreateCityModal';
import { editCityAction } from '../../features/cities/EditCityModal';
import { addCityUserAction } from '../../features/cities/AddCityUserModal';
import { removeCityUserAction } from '../../features/cities/RemoveCityUserModal';

export default function AllCities() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    city: null,
    name: '',
  });

  const response = useGetAllCitiesQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  const button = createUserCityButton;

  const actions = [editCityAction, addCityUserAction, removeCityUserAction];

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
