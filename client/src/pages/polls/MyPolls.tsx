import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMyPollsQuery } from '../../features/polls/polls.api';
import PollsTable from '../../features/polls/PollsTable';
import { createPollButton } from '../../features/polls/CreatePollModal';
import { completePollAction } from '../../features/polls/CompletePollModal';
import { deletePollAction } from '../../features/polls/DeletePollModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyPolls() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({ user: '', description: '' });

  const response = useGetMyPollsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.ADMIN) },
  ];

  const button = createPollButton;

  const actions = [completePollAction, deletePollAction];

  return (
    <PollsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      actions={actions}
      title='My Polls'
    />
  );
}
