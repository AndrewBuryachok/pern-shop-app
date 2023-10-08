import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllExchangesQuery } from '../../features/exchanges/exchanges.api';
import ExchangesTable from '../../features/exchanges/ExchangesTable';
import { createExchangeButton } from '../../features/exchanges/CreateExchangeModal';

export default function AllExchanges() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    modes: [Mode.EXECUTOR, Mode.CUSTOMER],
    mode: null,
    type: null,
  });

  const response = useGetAllExchangesQuery({ page, search });

  const links = [{ label: 'My', to: '../my' }];

  const button = createExchangeButton;

  return (
    <ExchangesTable
      {...response}
      title='All Exchanges'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
    />
  );
}
