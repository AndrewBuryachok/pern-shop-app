import { ITableWithActions } from '../../common/interfaces';
import { Poll } from './poll.model';
import { getCurrentUser } from '../auth/auth.slice';
import {
  useSelectLikedPollsQuery,
  useSelectViewedPollsQuery,
} from './polls.api';
import CustomList from '../../common/components/CustomList';
import PollPaper from './PollPaper';

type Props = ITableWithActions<Poll>;

export default function PollsList({ actions = [], ...props }: Props) {
  const user = getCurrentUser();

  const { data: viewedPolls, ...viewedPollsResponse } =
    useSelectViewedPollsQuery(undefined, { skip: !user });

  const { data: likedPolls, ...likedPollsResponse } = useSelectLikedPollsQuery(
    undefined,
    { skip: !user },
  );

  return (
    <CustomList {...props}>
      {props.data?.result
        .map((poll) => ({
          ...poll,
          viewed: !!viewedPolls?.includes(poll.id),
          upLiked: !!likedPolls?.find(
            (likedPoll) => likedPoll.id === poll.id && likedPoll.like.type,
          ),
          downLiked: !!likedPolls?.find(
            (likedPoll) => likedPoll.id === poll.id && !likedPoll.like.type,
          ),
        }))
        .map((poll) => (
          <PollPaper
            key={poll.id}
            poll={poll}
            isViewedLoading={viewedPollsResponse.isFetching}
            isLikedLoading={likedPollsResponse.isFetching}
            actions={actions}
          />
        ))}
    </CustomList>
  );
}
