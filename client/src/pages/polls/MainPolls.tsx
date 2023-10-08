import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMainPollsQuery } from '../../features/polls/polls.api';
import PollsTable from '../../features/polls/PollsTable';
import {
  createDownVoteAction,
  createUpVoteAction,
} from '../../features/polls/VotePollModal';
import { Role } from '../../common/constants';

export default function MainPolls() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    description: '',
  });

  const response = useGetMainPollsQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'All', to: 'all', role: Role.ADMIN },
  ];

  const actions = [createUpVoteAction, createDownVoteAction];

  return (
    <PollsTable
      {...response}
      title='Main Polls'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
