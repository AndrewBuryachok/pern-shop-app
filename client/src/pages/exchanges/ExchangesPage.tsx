import { useLocation, useSearchParams } from 'react-router-dom';
import { Mode } from '../../common/enums';
import {
  useGetAllExchangesQuery,
  useGetMyExchangesQuery,
} from '../../features/exchanges/exchanges.api';
import ExchangesTable from '../../features/exchanges/ExchangesTable';
import {
  createMyExchangeButton,
  createUserExchangeButton,
} from '../../features/exchanges/CreateExchangeModal';
import { deleteExchangeAction } from '../../features/exchanges/DeleteExchangeModal';

export default function ExchangesPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.EXECUTOR, Mode.CUSTOMER],
    mode: searchParams.get('mode') as Mode,
    type: searchParams.get('type'),
    minSum: +(searchParams.get('minSum') || 0) || null,
    maxSum: +(searchParams.get('maxSum') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  };

  const response = {
    my: useGetMyExchangesQuery,
    all: useGetAllExchangesQuery,
  }[tab]!(search);

  const button = { my: createMyExchangeButton, all: createUserExchangeButton }[
    tab
  ];

  const actions = { all: [deleteExchangeAction] }[tab];

  return (
    <ExchangesTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
