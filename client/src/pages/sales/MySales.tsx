import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMySalesQuery } from '../../features/sales/sales.api';
import SalesTable from '../../features/sales/SalesTable';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MySales() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    mode: 'false',
    filters: ['Buyer', 'Seller', 'Owner'].map((label) => ({
      label,
      value: true,
    })),
    storage: null,
    cell: null,
    item: null,
    description: '',
  });

  const response = useGetMySalesQuery({ page, search });

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
