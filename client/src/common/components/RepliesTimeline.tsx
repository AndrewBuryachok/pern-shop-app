import { Group, Skeleton, Timeline } from '@mantine/core';
import { IAction } from '../interfaces';
import { Reply } from '../../features/replies/reply.model';
import SingleText from './SingleText';
import CustomAvatar from './CustomAvatar';
import CustomActions from './CustomActions';
import { parseTime } from '../utils';

type Props = {
  data?: Reply[];
  isLoading: boolean;
  actions: IAction<Reply>[];
};

export default function RepliesTimeline(props: Props) {
  return (
    <Timeline bulletSize={32}>
      {props.isLoading && (
        <Timeline.Item title={<Skeleton w={64} h={16} />}>
          <Skeleton w={128} h={16} />
        </Timeline.Item>
      )}
      {props.data?.map((reply) => (
        <Timeline.Item
          key={reply.id}
          title={<SingleText text={reply.user.nick} />}
          bullet={<CustomAvatar {...reply.user} />}
        >
          <Group spacing={0} position='apart' align='flex-start' noWrap>
            <div>
              <SingleText text={reply.text} />
              <SingleText text={parseTime(reply.createdAt)} />
            </div>
            <CustomActions data={reply} actions={props.actions} />
          </Group>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
