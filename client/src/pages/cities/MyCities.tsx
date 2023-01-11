import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetMyCitiesQuery } from '../../features/cities/cities.api';
import CitiesTable from '../../features/cities/CitiesTable';
import { createCityButton } from '../../features/cities/CreateCityModal';
import { editCityAction } from '../../features/cities/EditCityModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyCities() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetMyCitiesQuery({ page, search: debounced });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.ADMIN) },
  ];

  const button = createCityButton;

  const actions = [editCityAction];

  return (
    <CitiesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      title='My Cities'
      actions={actions}
    />
  );
}
