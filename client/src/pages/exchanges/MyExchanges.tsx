import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetMyExchangesQuery } from '../../features/exchanges/exchanges.api';
import ExchangesTable from '../../features/exchanges/ExchangesTable';
import { Role } from '../../common/constants';

export default function MyExchanges() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    filters: [Filter.EXECUTOR, Filter.CUSTOMER].map((label) => ({
      label,
      value: true,
    })),
    mode: Mode.SOME,
    type: null,
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
