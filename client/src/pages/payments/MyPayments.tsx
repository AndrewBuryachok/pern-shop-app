import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMyPaymentsQuery } from '../../features/payments/payments.api';
import PaymentsTable from '../../features/payments/PaymentsTable';
import { createMyPaymentButton } from '../../features/payments/CreatePaymentModal';
import { Role } from '../../common/constants';

export default function MyPayments() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.SENDER, Mode.RECEIVER],
    mode: searchParams.get('mode') as Mode,
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
