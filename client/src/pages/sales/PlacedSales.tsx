import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetPlacedSalesQuery } from '../../features/sales/sales.api';
import SalesTable from '../../features/sales/SalesTable';
import { Role } from '../../common/constants';

export default function PlacedSales() {
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

  const response = useGetPlacedSalesQuery({ page, search });

  const links = [
    { label: 'My', to: '../my' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  return (
    <SalesTable
      {...response}
      title='Placed Sales'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
