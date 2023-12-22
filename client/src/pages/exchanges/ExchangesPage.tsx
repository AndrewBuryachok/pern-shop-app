import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import {
  useGetAllExchangesQuery,
  useGetMyExchangesQuery,
} from '../../features/exchanges/exchanges.api';
import ExchangesTable from '../../features/exchanges/ExchangesTable';
import { createExchangeButton } from '../../features/exchanges/CreateExchangeModal';

export default function MyExchanges() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
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
  });

  const response = {
    my: useGetMyExchangesQuery,
    all: useGetAllExchangesQuery,
  }[tab]!({ page, search });

  const button = { all: createExchangeButton }[tab];

  return (
    <ExchangesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
    />
  );
}
