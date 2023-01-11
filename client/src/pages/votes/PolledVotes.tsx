import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetPolledVotesQuery } from '../../features/votes/votes.api';
import VotesTable from '../../features/votes/VotesTable';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function PolledVotes() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetPolledVotesQuery({ page, search: debounced });

  const links = [
    { label: 'My', to: '../my' },
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.ADMIN) },
  ];

  return (
    <VotesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='Polled Votes'
    />
  );
}
