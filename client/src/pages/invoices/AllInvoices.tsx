import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetAllInvoicesQuery } from '../../features/invoices/invoices.api';
import InvoicesTable from '../../features/invoices/InvoicesTable';

export default function AllInvoices() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetAllInvoicesQuery({ page, search: debounced });

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
