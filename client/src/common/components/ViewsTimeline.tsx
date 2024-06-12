import { Skeleton, Timeline } from '@mantine/core';
import { View } from '../../features/views/view.model';
import SingleText from './SingleText';
import CustomAvatar from './CustomAvatar';
import { parseTime } from '../utils';

type Props = {
  data?: View[];
  isFetching: boolean;
};

export default function ViewsTimeline(props: Props) {
  return (
    <Timeline bulletSize={32}>
      {props.isFetching && (
        <Timeline.Item title={<Skeleton w={64} h={16} />}>
          <Skeleton w={128} h={16} />
        </Timeline.Item>
      )}
      {props.data?.map((view) => (
        <Timeline.Item
          key={view.id}
          title={<SingleText text={view.user.nick} bold />}
          bullet={<CustomAvatar {...view.user} />}
        >
          <SingleText text={parseTime(view.createdAt)} dimmed />
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
