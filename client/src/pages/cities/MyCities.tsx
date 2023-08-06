import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMyCitiesQuery } from '../../features/cities/cities.api';
import CitiesTable from '../../features/cities/CitiesTable';
import { createCityButton } from '../../features/cities/CreateCityModal';
import { editCityAction } from '../../features/cities/EditCityModal';
import { addCityUserAction } from '../../features/cities/AddCityUserModal';
import { removeCityUserAction } from '../../features/cities/RemoveCityUserModal';
import { Role } from '../../common/constants';

export default function MyCities() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    city: null,
    name: '',
  });

  const response = useGetMyCitiesQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', role: Role.ADMIN },
  ];

  const button = createCityButton;

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
