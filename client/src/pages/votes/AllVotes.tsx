import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllVotesQuery } from '../../features/votes/votes.api';
import VotesTable from '../../features/votes/VotesTable';

export default function AllVotes() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: '',
    filters: ['Mode', 'Voter', 'Poller'].map((label, index) => ({
      label,
      value: !!index,
    })),
    description: '',
    type: '',
  });

  const response = useGetAllVotesQuery({ page, search });

  const links = [{ label: 'My', to: '../my' }];

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
