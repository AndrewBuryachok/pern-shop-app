import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMyPollsQuery } from '../../features/polls/polls.api';
import PollsTable from '../../features/polls/PollsTable';
import { createPollButton } from '../../features/polls/CreatePollModal';
import { completePollAction } from '../../features/polls/CompletePollModal';
import { deletePollAction } from '../../features/polls/DeletePollModal';
import { Role } from '../../common/constants';

export default function MyPolls() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    description: '',
  });

  const response = useGetMyPollsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', role: Role.ADMIN },
  ];

  const button = createPollButton;

  const actions = [completePollAction, deletePollAction];

  return (
    <PollsTable
      {...response}
      title='My Polls'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      actions={actions}
    />
  );
}
