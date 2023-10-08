import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMyExchangesQuery } from '../../features/exchanges/exchanges.api';
import ExchangesTable from '../../features/exchanges/ExchangesTable';
import { Role } from '../../common/constants';

export default function MyExchanges() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.EXECUTOR, Mode.CUSTOMER],
    mode: searchParams.get('mode') as Mode,
    type: searchParams.get('type'),
  });

  const response = useGetMyExchangesQuery({ page, search });

  const links = [{ label: 'All', to: '../all', role: Role.BANKER }];

  return (
    <ExchangesTable
      {...response}
      title='My Exchanges'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
