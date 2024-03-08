import { ITableWithActions } from '../../common/interfaces';
import { Poll } from './poll.model';
import { getCurrentUser } from '../auth/auth.slice';
import {
  useSelectViewedPollsQuery,
  useSelectVotedPollsQuery,
} from './polls.api';
import CustomList from '../../common/components/CustomList';
import PollPaper from './PollPaper';

type Props = ITableWithActions<Poll>;

export default function PollsList({ actions = [], ...props }: Props) {
  const user = getCurrentUser();

  const { data: viewedPolls, ...viewedPollsResponse } =
    useSelectViewedPollsQuery(undefined, { skip: !user });

  const { data: votedPolls, ...votedPollsResponse } = useSelectVotedPollsQuery(
    undefined,
    { skip: !user },
  );

  return (
    <CustomList {...props}>
      {props.data?.result
        .map((poll) => ({
          ...poll,
          viewed: !!viewedPolls?.includes(poll.id),
          upVoted: votedPolls?.find(
            (votedPoll) => votedPoll.id === poll.id && votedPoll.vote.type,
          ),
          downVoted: votedPolls?.find(
            (votedPoll) => votedPoll.id === poll.id && !votedPoll.vote.type,
          ),
        }))
        .map((poll) => (
          <PollPaper
            key={poll.id}
            poll={poll}
            isViewedLoading={viewedPollsResponse.isFetching}
            isVotedLoading={votedPollsResponse.isFetching}
            actions={actions}
          />
        ))}
    </CustomList>
  );
}
