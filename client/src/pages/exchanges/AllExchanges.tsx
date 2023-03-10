import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetAllExchangesQuery } from '../../features/exchanges/exchanges.api';
import ExchangesTable from '../../features/exchanges/ExchangesTable';
import { createExchangeButton } from '../../features/exchanges/CreateExchangeModal';

export default function AllExchanges() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetAllExchangesQuery({ page, search: debounced });

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
