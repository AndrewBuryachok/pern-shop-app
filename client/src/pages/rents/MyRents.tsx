import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetMyRentsQuery } from '../../features/rents/rents.api';
import RentsTable from '../../features/rents/RentsTable';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyRents() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetMyRentsQuery({ page, search: debounced });

  const links = [
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.MANAGER) },
  ];

  return (
    <RentsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='My Rents'
    />
  );
}
