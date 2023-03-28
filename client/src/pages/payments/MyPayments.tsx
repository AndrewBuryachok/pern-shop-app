import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetMyPaymentsQuery } from '../../features/payments/payments.api';
import PaymentsTable from '../../features/payments/PaymentsTable';
import { createPaymentButton } from '../../features/payments/CreatePaymentModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyPayments() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    filters: [Filter.SENDER, Filter.RECEIVER].map((label) => ({
      label,
      value: true,
    })),
    mode: Mode.SOME,
    description: '',
  });

  const response = useGetMyPaymentsQuery({ page, search });

  const links = [
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.BANKER) },
  ];

  const button = createPaymentButton;

  return (
    <PaymentsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      title='My Payments'
    />
  );
}
