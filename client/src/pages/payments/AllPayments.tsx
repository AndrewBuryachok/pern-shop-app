import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllPaymentsQuery } from '../../features/payments/payments.api';
import PaymentsTable from '../../features/payments/PaymentsTable';

export default function AllPayments() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    mode: 'false',
    filters: ['Sender', 'Receiver'].map((label) => ({
      label,
      value: true,
    })),
    description: '',
  });

  const response = useGetAllPaymentsQuery({ page, search });

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
