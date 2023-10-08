import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllVotesQuery } from '../../features/votes/votes.api';
import VotesTable from '../../features/votes/VotesTable';

export default function AllVotes() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    modes: [Mode.VOTER, Mode.POLLER],
    mode: searchParams.get('mode') as Mode,
    description: '',
    type: searchParams.get('type'),
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
