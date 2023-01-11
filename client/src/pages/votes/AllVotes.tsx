import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetAllVotesQuery } from '../../features/votes/votes.api';
import VotesTable from '../../features/votes/VotesTable';

export default function AllVotes() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetAllVotesQuery({ page, search: debounced });

  const links = [
    { label: 'My', to: '../my' },
    { label: 'Polled', to: '../polled' },
  ];

  return (
    <VotesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Votes'
    />
  );
}
