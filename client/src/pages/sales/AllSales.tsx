import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllSalesQuery } from '../../features/sales/sales.api';
import SalesTable from '../../features/sales/SalesTable';
import { rateSaleAction } from '../../features/sales/RateSaleModal';

export default function AllSales() {
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

  const response = useGetAllSalesQuery({ page, search });

  const links = [
    { label: 'My', to: '../my' },
    { label: 'Placed', to: '../placed' },
  ];

  const actions = [rateSaleAction];

  return (
    <SalesTable
      {...response}
      title='All Sales'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
