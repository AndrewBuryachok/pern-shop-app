import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMyVotesQuery } from '../../features/votes/votes.api';
import VotesTable from '../../features/votes/VotesTable';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyVotes() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: '',
    mode: 'false',
    filters: ['Voter', 'Poller'].map((label) => ({
      label,
      value: true,
    })),
    description: '',
    type: '',
  });

  const response = useGetMyVotesQuery({ page, search });

  const links = [
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
      title='My Votes'
    />
  );
}
