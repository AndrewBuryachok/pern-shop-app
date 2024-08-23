import { useTranslation } from 'react-i18next';
import { Flex, Group, Skeleton, Stack, Timeline } from '@mantine/core';
import { IAction } from '../interfaces';
import { Reply } from '../../features/replies/reply.model';
import { getCurrentUser } from '../../features/auth/auth.slice';
import SingleText from './SingleText';
import LinkedAvatarWithoutIndicator from './LinkedAvatarWithoutIndicator';
import LinkedAvatar from './LinkedAvatar';
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

export default function MessagesTimeline(props: Props) {
  const [t] = useTranslation();

  const user = getCurrentUser();

  return (
    <Stack spacing={16}>
      {props.isFetching
        ? [...Array(2).keys()].map((key) => (
            <Timeline key={key} bulletSize={32} align={key ? 'right' : 'left'}>
              <Timeline.Item
                title={
                  <Group spacing={0} position={key ? 'right' : 'left'}>
                    <Skeleton w={64} h={16} />
                  </Group>
                }
              >
                <Group spacing={0} position={key ? 'right' : 'left'}>
                  <Skeleton w={128} h={16} />
                </Group>
              </Timeline.Item>
            </Timeline>
          ))
        : props.data?.map((reply) => (
            <Timeline
              key={reply.id}
              bulletSize={32}
              align={reply.user.id === user?.id ? 'right' : 'left'}
            >
              <Timeline.Item
                title={
                  <Flex
                    gap={8}
                    direction={
                      reply.user.id === user?.id ? 'row-reverse' : 'row'
                    }
                  >
                    <SingleText text={reply.user.nick} bold />
                    <SingleText text={parseTime(reply.createdAt)} dimmed />
                  </Flex>
                }
                bullet={
                  reply.user.id === user?.id ? (
                    <LinkedAvatarWithoutIndicator {...reply.user} />
                  ) : (
                    <LinkedAvatar {...reply.user} />
                  )
                }
              >
                {reply.reply && (
                  <ReplyAvatarWithText
                    {...reply.reply}
                    right={reply.user.id === user?.id}
                    divider
                  />
                )}
                <CustomHighlight text={reply.text} />
                <Group
                  spacing={8}
                  position={reply.user.id === user?.id ? 'right' : 'left'}
                >
                  <CustomAnchor
                    text={t('actions.reply')}
                    open={() => props.reply(reply)}
                  />
                  <CustomActions data={reply} actions={props.actions} />
                </Group>
              </Timeline.Item>
            </Timeline>
          ))}
    </Stack>
  );
}
