import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import {
  useGetAllPaymentsQuery,
  useGetMyPaymentsQuery,
} from '../../features/payments/payments.api';
import PaymentsTable from '../../features/payments/PaymentsTable';
import {
  createMyPaymentButton,
  createUserPaymentButton,
} from '../../features/payments/CreatePaymentModal';

export default function PaymentsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.SENDER, Mode.RECEIVER],
    mode: searchParams.get('mode') as Mode,
    description: searchParams.get('description') || '',
    minSum: +(searchParams.get('minSum') || 0) || null,
    maxSum: +(searchParams.get('maxSum') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    my: useGetMyPaymentsQuery,
    all: useGetAllPaymentsQuery,
  }[tab]!({ page, search });

  const button = {
    my: createMyPaymentButton,
    all: createUserPaymentButton,
  }[tab];

  return (
    <PaymentsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
    />
  );
}
