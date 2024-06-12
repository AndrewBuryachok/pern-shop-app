import { Skeleton, Timeline } from '@mantine/core';
import { Reaction } from '../../features/reactions/reaction.model';
import SingleText from './SingleText';
import CustomAvatar from './CustomAvatar';
import ReactionBadge from './ReactionBadge';
import { parseTime } from '../utils';

type Props = {
  data?: Reaction[];
  isFetching: boolean;
};

export default function ReactionsTimeline(props: Props) {
  return (
    <Timeline bulletSize={32}>
      {props.isFetching && (
        <Timeline.Item title={<Skeleton w={64} h={16} />}>
          <Skeleton w={128} h={16} />
        </Timeline.Item>
      )}
      {props.data?.map((reaction) => (
        <Timeline.Item
          key={reaction.id}
          title={<SingleText text={reaction.user.nick} bold />}
          bullet={<CustomAvatar {...reaction.user} />}
        >
          <ReactionBadge {...reaction} />
          <SingleText text={parseTime(reaction.createdAt)} dimmed />
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
