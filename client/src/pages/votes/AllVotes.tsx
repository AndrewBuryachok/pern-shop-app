import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetAllVotesQuery } from '../../features/votes/votes.api';
import VotesTable from '../../features/votes/VotesTable';

export default function AllVotes() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    filters: [Filter.VOTER, Filter.POLLER].map((label) => ({
      label,
      value: true,
    })),
    mode: Mode.SOME,
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
