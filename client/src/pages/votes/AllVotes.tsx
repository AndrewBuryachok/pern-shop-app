import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllVotesQuery } from '../../features/votes/votes.api';
import VotesTable from '../../features/votes/VotesTable';

export default function AllVotes() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    modes: [Mode.VOTER, Mode.POLLER],
    mode: null,
    description: '',
    type: null,
  });

  const response = useGetAllVotesQuery({ page, search });

  const links = [
    { label: 'My', to: '../my' },
    { label: 'Polled', to: '../polled' },
  ];

  return (
    <VotesTable
      {...response}
      title='All Votes'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
