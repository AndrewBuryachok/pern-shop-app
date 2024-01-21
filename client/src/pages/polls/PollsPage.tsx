import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import {
  useGetAllPollsQuery,
  useGetDiscussedPollsQuery,
  useGetMainPollsQuery,
  useGetMyPollsQuery,
  useGetVotedPollsQuery,
} from '../../features/polls/polls.api';
import PollsTable from '../../features/polls/PollsTable';
import {
  createMyPollButton,
  createUserPollButton,
} from '../../features/polls/CreatePollModal';
import { votePollAction } from '../../features/polls/VotePollModal';
import { createDiscussionAction } from '../../features/discussions/CreateDiscussionModal';
import { completePollAction } from '../../features/polls/CompletePollModal';
import { deletePollAction } from '../../features/polls/DeletePollModal';

export default function PollsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    title: searchParams.get('title') || '',
    result: searchParams.get('result'),
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    main: useGetMainPollsQuery,
    my: useGetMyPollsQuery,
    voted: useGetVotedPollsQuery,
    discussed: useGetDiscussedPollsQuery,
    all: useGetAllPollsQuery,
  }[tab]!({ page, search });

  const button = {
    main: createMyPollButton,
    my: createMyPollButton,
    all: createUserPollButton,
  }[tab];

  const actions = {
    main: [createDiscussionAction, votePollAction],
    my: [createDiscussionAction, votePollAction, deletePollAction],
    voted: [createDiscussionAction, votePollAction],
    discussed: [createDiscussionAction, votePollAction],
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
