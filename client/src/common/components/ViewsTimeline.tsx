import { Skeleton, Timeline } from '@mantine/core';
import { View } from '../../features/views/view.model';
import SingleText from './SingleText';
import CustomAvatar from './CustomAvatar';
import { parseTime } from '../utils';

type Props = {
  data?: View[];
  isLoading: boolean;
};

export default function ViewsTimeline(props: Props) {
  return (
    <Timeline bulletSize={32}>
      {props.isLoading && (
        <Timeline.Item title={<Skeleton w={64} h={16} />}>
          <Skeleton w={128} h={16} />
        </Timeline.Item>
      )}
      {props.data?.map((view) => (
        <Timeline.Item
          key={view.id}
          title={<SingleText text={view.user.nick} />}
          bullet={<CustomAvatar {...view.user} />}
        >
          <SingleText text={parseTime(view.createdAt)} />
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
