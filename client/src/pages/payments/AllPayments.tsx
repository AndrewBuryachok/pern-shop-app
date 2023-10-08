import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllPaymentsQuery } from '../../features/payments/payments.api';
import PaymentsTable from '../../features/payments/PaymentsTable';
import { createUserPaymentButton } from '../../features/payments/CreatePaymentModal';

export default function AllPayments() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    modes: [Mode.SENDER, Mode.RECEIVER],
    mode: null,
    description: '',
  });

  const response = useGetAllPaymentsQuery({ page, search });

  const links = [{ label: 'My', to: '../my' }];

  const button = createUserPaymentButton;

  return (
    <PaymentsTable
      {...response}
      title='All Payments'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
    />
  );
}
