import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetPolledVotesQuery } from '../../features/votes/votes.api';
import VotesTable from '../../features/votes/VotesTable';
import { Role } from '../../common/constants';

export default function PolledVotes() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    modes: [Mode.VOTER, Mode.POLLER],
    mode: null,
    description: '',
    type: null,
  });

  const response = useGetPolledVotesQuery({ page, search });

  const links = [
    { label: 'My', to: '../my' },
    { label: 'All', to: '../all', role: Role.ADMIN },
  ];

  return (
    <VotesTable
      {...response}
      title='Polled Votes'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
