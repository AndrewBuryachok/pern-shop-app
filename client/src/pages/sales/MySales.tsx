import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMySalesQuery } from '../../features/sales/sales.api';
import SalesTable from '../../features/sales/SalesTable';
import { rateSaleAction } from '../../features/sales/RateSaleModal';
import { Role } from '../../common/constants';

export default function MySales() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    modes: [Mode.BUYER, Mode.SELLER, Mode.OWNER],
    mode: null,
    storage: null,
    cell: null,
    item: null,
    description: '',
    rate: null,
  });

  const response = useGetMySalesQuery({ page, search });

  const links = [
    { label: 'Placed', to: '../placed' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  const actions = [rateSaleAction];

  return (
    <SalesTable
      {...response}
      title='My Sales'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
