import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetMainWaresQuery } from '../../features/wares/wares.api';
import WaresTable from '../../features/wares/WaresTable';
import { buyWareAction } from '../../features/wares/BuyWareModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MainWares() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetMainWaresQuery({ page, search: debounced });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'All', to: 'all', disabled: isUserNotHasRole(Role.MANAGER) },
  ];

  const actions = [buyWareAction];

  return (
    <WaresTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='Main Wares'
      actions={actions}
    />
  );
}
