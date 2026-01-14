import { useLocation, useSearchParams } from 'react-router-dom';
import { Mode } from '../../common/enums';
import {
  useGetAllTransactionsQuery,
  useGetMyTransactionsQuery,
} from '../../features/transactions/transactions.api';
import TransactionsTable from '../../features/transactions/TransactionsTable';
import {
  createMyTransactionButton,
  createUserTransactionButton,
} from '../../features/transactions/CreateTransactionModal';
import { deleteTransactionAction } from '../../features/transactions/DeleteTransactionModal';

export default function TransactionsPage() {
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
    my: useGetMyTransactionsQuery,
    all: useGetAllTransactionsQuery,
  }[tab]!(search);

  const button = {
    my: createMyTransactionButton,
    all: createUserTransactionButton,
  }[tab];

  const actions = { all: [deleteTransactionAction] }[tab];

  return (
    <TransactionsTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
