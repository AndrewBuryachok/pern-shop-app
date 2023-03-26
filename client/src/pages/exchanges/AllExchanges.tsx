import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllExchangesQuery } from '../../features/exchanges/exchanges.api';
import ExchangesTable from '../../features/exchanges/ExchangesTable';
import { createExchangeButton } from '../../features/exchanges/CreateExchangeModal';

export default function AllExchanges() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: '',
    card: '',
    mode: 'false',
    filters: ['Executor', 'Customer'].map((label) => ({
      label,
      value: true,
    })),
    type: '',
  });

  const response = useGetAllExchangesQuery({ page, search });

  const links = [{ label: 'My', to: '../my' }];

  const button = createExchangeButton;

  return (
    <ExchangesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      title='All Exchanges'
    />
  );
}
