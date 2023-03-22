import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetMySalesQuery } from '../../features/sales/sales.api';
import SalesTable from '../../features/sales/SalesTable';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MySales() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetMySalesQuery({ page, search: debounced });

  const links = [
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.MANAGER) },
  ];

  return (
    <SalesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='My Sales'
    />
  );
}
