import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllInvoicesQuery } from '../../features/invoices/invoices.api';
import InvoicesTable from '../../features/invoices/InvoicesTable';

export default function AllInvoices() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: '',
    filters: ['Mode', 'Sender', 'Receiver'].map((label, index) => ({
      label,
      value: !!index,
    })),
    description: '',
  });

  const response = useGetAllInvoicesQuery({ page, search });

  const links = [{ label: 'My', to: '../my' }];

  return (
    <InvoicesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Invoices'
    />
  );
}
