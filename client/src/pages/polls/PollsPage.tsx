import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import {
  useGetAllPollsQuery,
  useGetMainPollsQuery,
  useGetMyPollsQuery,
  useGetVotedPollsQuery,
} from '../../features/polls/polls.api';
import PollsTable from '../../features/polls/PollsTable';
import { createPollButton } from '../../features/polls/CreatePollModal';
import {
  downVotePollAction,
  upVotePollAction,
} from '../../features/polls/VotePollModal';
import { completePollAction } from '../../features/polls/CompletePollModal';
import { deletePollAction } from '../../features/polls/DeletePollModal';

export default function MyPolls() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    title: searchParams.get('title') || '',
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    main: useGetMainPollsQuery,
    my: useGetMyPollsQuery,
    voted: useGetVotedPollsQuery,
    all: useGetAllPollsQuery,
  }[tab]!({ page, search });

  const button = { my: createPollButton }[tab];

  const actions = {
    main: [upVotePollAction, downVotePollAction],
    my: [completePollAction, deletePollAction],
    voted: [upVotePollAction, downVotePollAction],
    all: [completePollAction, deletePollAction],
  }[tab];

  return (
    <PollsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
      actions={actions}
    />
  );
}
