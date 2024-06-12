import { useLocation, useSearchParams } from 'react-router-dom';
import {
  useGetAllPollsQuery,
  useGetDiscussedPollsQuery,
  useGetMainPollsQuery,
  useGetMyPollsQuery,
  useGetVotedPollsQuery,
} from '../../features/polls/polls.api';
import PollsList from '../../features/polls/PollsList';
import {
  createMyPollButton,
  createUserPollButton,
} from '../../features/polls/CreatePollModal';
import { editPollAction } from '../../features/polls/EditPollModal';
import { completePollAction } from '../../features/polls/CompletePollModal';
import { deletePollAction } from '../../features/polls/DeletePollModal';

export default function PollsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    mark: searchParams.get('mark'),
    result: searchParams.get('result'),
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  };

  const response = {
    main: useGetMainPollsQuery,
    my: useGetMyPollsQuery,
    voted: useGetVotedPollsQuery,
    discussed: useGetDiscussedPollsQuery,
    all: useGetAllPollsQuery,
  }[tab]!(search);

  const button = {
    main: createMyPollButton,
    my: createMyPollButton,
    all: createUserPollButton,
  }[tab];

  const actions = {
    main: [editPollAction, deletePollAction],
    my: [editPollAction, deletePollAction],
    all: [completePollAction, editPollAction, deletePollAction],
  }[tab];

  return (
    <PollsList
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
