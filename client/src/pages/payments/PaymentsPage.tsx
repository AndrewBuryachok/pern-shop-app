import { useLocation, useSearchParams } from 'react-router-dom';
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
import { deletePaymentAction } from '../../features/payments/DeletePaymentModal';

export default function PaymentsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
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
  };

  const response = {
    my: useGetMyPaymentsQuery,
    all: useGetAllPaymentsQuery,
  }[tab]!(search);

  const button = {
    my: createMyPaymentButton,
    all: createUserPaymentButton,
  }[tab];

  const actions = { all: [deletePaymentAction] }[tab];

  return (
    <PaymentsTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
