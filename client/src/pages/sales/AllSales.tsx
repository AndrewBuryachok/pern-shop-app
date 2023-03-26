import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllSalesQuery } from '../../features/sales/sales.api';
import SalesTable from '../../features/sales/SalesTable';

export default function AllSales() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: '',
    card: '',
    mode: 'false',
    filters: ['Buyer', 'Seller', 'Owner'].map((label) => ({
      label,
      value: true,
    })),
    storage: '',
    cell: '',
    item: '',
    description: '',
  });

  const response = useGetAllSalesQuery({ page, search });

  const links = [{ label: 'My', to: '../my' }];

  return (
    <SalesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Sales'
    />
  );
}
