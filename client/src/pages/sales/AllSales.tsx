import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllSalesQuery } from '../../features/sales/sales.api';
import SalesTable from '../../features/sales/SalesTable';
import { rateSaleAction } from '../../features/sales/RateSaleModal';

export default function AllSales() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.BUYER, Mode.SELLER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    storage: searchParams.get('storage'),
    cell: searchParams.get('cell'),
    item: searchParams.get('item'),
    description: '',
    rate: +(searchParams.get('rate') || 0) || null,
  });

  const response = useGetAllSalesQuery({ page, search });

  const links = [
    { label: 'My', to: '../my' },
    { label: 'Selled', to: '../selled' },
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
