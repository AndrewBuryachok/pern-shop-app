import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
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

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetMainPollsQuery({ page, search: debounced });

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
