import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMyCitiesQuery } from '../../features/cities/cities.api';
import CitiesTable from '../../features/cities/CitiesTable';
import { createMyCityButton } from '../../features/cities/CreateCityModal';
import { editMyCityAction } from '../../features/cities/EditCityModal';
import { addMyCityUserAction } from '../../features/cities/AddCityUserModal';
import { removeMyCityUserAction } from '../../features/cities/RemoveCityUserModal';
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

  const actions = [
    editMyCityAction,
    addMyCityUserAction,
    removeMyCityUserAction,
  ];

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
