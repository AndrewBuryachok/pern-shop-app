import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMyExchangesQuery } from '../../features/exchanges/exchanges.api';
import ExchangesTable from '../../features/exchanges/ExchangesTable';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyExchanges() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: '',
    filters: ['Mode', 'Executor', 'Customer'].map((label, index) => ({
      label,
      value: !!index,
    })),
    type: '',
  });

  const [filters, setFilters] = useState(
    ['Executor', 'Customer'].map((label) => ({ label, value: false })),
  );

  const response = useGetMyExchangesQuery({ page, search });

  const links = [
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.BANKER) },
  ];

  return (
    <ExchangesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='My Exchanges'
    />
  );
}
