import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMainPollsQuery } from '../../features/polls/polls.api';
import PollsTable from '../../features/polls/PollsTable';
import {
  createDownVoteAction,
  createUpVoteAction,
} from '../../features/polls/VotePollModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MainPolls() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    description: '',
  });

  const response = useGetMainPollsQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'All', to: 'all', disabled: isUserNotHasRole(Role.ADMIN) },
  ];

  const actions = [createUpVoteAction, createDownVoteAction];

  return (
    <PollsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='Main Polls'
      actions={actions}
    />
  );
}
