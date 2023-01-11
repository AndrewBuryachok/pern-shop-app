import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetMyWaresQuery } from '../../features/wares/wares.api';
import WaresTable from '../../features/wares/WaresTable';
import { createWareButton } from '../../features/wares/CreateWareModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyWares() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetMyWaresQuery({ page, search: debounced });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'Placed', to: '../placed' },
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.MANAGER) },
  ];

  const button = createWareButton;

  return (
    <WaresTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      title='My Wares'
    />
  );
}
