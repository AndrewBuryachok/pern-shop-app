import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetAllPaymentsQuery } from '../../features/payments/payments.api';
import PaymentsTable from '../../features/payments/PaymentsTable';

export default function AllPayments() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetAllPaymentsQuery({ page, search: debounced });

  const links = [{ label: 'My', to: '../my' }];

  return (
    <PaymentsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Payments'
    />
  );
}
