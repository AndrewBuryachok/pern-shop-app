import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMainCitiesQuery } from '../../features/cities/cities.api';
import CitiesTable from '../../features/cities/CitiesTable';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MainCities() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({ user: '', name: '' });

  const response = useGetMainCitiesQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'All', to: 'all', disabled: isUserNotHasRole(Role.ADMIN) },
  ];

  return (
    <CitiesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='Main Cities'
    />
  );
}
