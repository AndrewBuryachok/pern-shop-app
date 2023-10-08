import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMyCitiesQuery } from '../../features/cities/cities.api';
import CitiesTable from '../../features/cities/CitiesTable';
import { createMyCityButton } from '../../features/cities/CreateCityModal';
import { editCityAction } from '../../features/cities/EditCityModal';
import { addCityUserAction } from '../../features/cities/AddCityUserModal';
import { removeCityUserAction } from '../../features/cities/RemoveCityUserModal';
import { Role } from '../../common/constants';

export default function MyCities() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    city: searchParams.get('city'),
    name: searchParams.get('name') || '',
  });

  const response = useGetMyCitiesQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', role: Role.ADMIN },
  ];

  const button = createMyCityButton;

  const actions = [editCityAction, addCityUserAction, removeCityUserAction];

  return (
    <CitiesTable
      {...response}
      title='My Cities'
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
