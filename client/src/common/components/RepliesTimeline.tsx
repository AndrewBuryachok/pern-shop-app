import { useTranslation } from 'react-i18next';
import { Group, Skeleton, Timeline } from '@mantine/core';
import { IAction } from '../interfaces';
import { Reply } from '../../features/replies/reply.model';
import SingleText from './SingleText';
import CustomAvatar from './CustomAvatar';
import ReplyAvatarWithText from './ReplyAvatarWithText';
import CustomHighlight from './CustomHighlight';
import CustomAnchor from './CustomAnchor';
import CustomActions from './CustomActions';
import { parseTime } from '../utils';

type Props = {
  data?: Reply[];
  isFetching: boolean;
  actions: IAction<Reply>[];
  reply: (reply: Reply) => void;
};

export default function RepliesTimeline(props: Props) {
  const [t] = useTranslation();

  return (
    <Timeline bulletSize={32}>
      {props.isFetching
        ? [...Array(2).keys()].map((key) => (
            <Timeline.Item key={key} title={<Skeleton w={64} h={16} />}>
              <Skeleton w={128} h={16} />
            </Timeline.Item>
          ))
        : props.data?.map((reply) => (
            <Timeline.Item
              key={reply.id}
              title={
                <Group spacing={8}>
                  <SingleText text={reply.user.nick} bold />
                  <SingleText text={parseTime(reply.createdAt)} dimmed />
                </Group>
              }
              bullet={<CustomAvatar {...reply.user} />}
            >
              {reply.reply && <ReplyAvatarWithText {...reply.reply} divider />}
              <CustomHighlight text={reply.text} />
              <Group spacing={8}>
                <CustomAnchor
                  text={t('actions.reply')}
                  open={() => props.reply(reply)}
                />
                <CustomActions data={reply} actions={props.actions} />
              </Group>
            </Timeline.Item>
          ))}
    </Timeline>
  );
}
