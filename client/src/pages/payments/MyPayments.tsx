import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMyPaymentsQuery } from '../../features/payments/payments.api';
import PaymentsTable from '../../features/payments/PaymentsTable';
import { createMyPaymentButton } from '../../features/payments/CreatePaymentModal';
import { Role } from '../../common/constants';

export default function MyPayments() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    modes: [Mode.SENDER, Mode.RECEIVER],
    mode: null,
    description: '',
  });

  const response = useGetMyPaymentsQuery({ page, search });

  const links = [{ label: 'All', to: '../all', role: Role.BANKER }];

  const button = createMyPaymentButton;

  return (
    <PaymentsTable
      {...response}
      title='My Payments'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
    />
  );
}
