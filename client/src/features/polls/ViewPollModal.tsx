import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  Group,
  Input,
  Skeleton,
  Stack,
  Textarea,
  TextInput,
  Timeline,
} from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { getCurrentUser } from '../auth/auth.slice';
import {
  useSelectPollDiscussionsQuery,
  useSelectPollVotesQuery,
} from './polls.api';
import CustomAvatar from '../../common/components/CustomAvatar';
import VoteBadge from '../../common/components/VoteBadge';
import SingleText from '../../common/components/SingleText';
import CustomActions from '../../common/components/CustomActions';
import { editDiscussionAction } from '../discussions/EditDiscussionModal';
import { deleteDiscussionAction } from '../discussions/DeleteDiscussionModal';
import { parseTime } from '../../common/utils';
import { Color, results } from '../../common/constants';

type Props = IModal<Poll>;

export default function ViewPollModal({ data: poll }: Props) {
  const [t] = useTranslation();

  const user = getCurrentUser();

  const { data: votes, ...votesResponse } = useSelectPollVotesQuery(poll.id);
  const { data: discussions, ...discussionsResponse } =
    useSelectPollDiscussionsQuery(poll.id);

  const myVote = votes?.find((vote) => vote.user.id === user?.id);

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={poll.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...poll.user} />}
        iconWidth={48}
        value={poll.user.nick}
        readOnly
      />
      <TextInput label={t('columns.title')} value={poll.title} readOnly />
      <Textarea label={t('columns.text')} value={poll.text} autosize readOnly />
      <TextInput
        label={t('columns.vote')}
        value={
          myVote ? (myVote.type ? t('constants.up') : t('constants.down')) : '-'
        }
        readOnly
      />
      <Input.Wrapper label={t('columns.votes')}>
        <Timeline bulletSize={32}>
          {votesResponse.isLoading && (
            <Timeline.Item title={<Skeleton w={64} h={16} />}>
              <Skeleton w={16} h={16} />
              <Skeleton w={128} h={16} />
            </Timeline.Item>
          )}
          {votes?.map((vote) => (
            <Timeline.Item
              key={vote.id}
              title={vote.user.nick}
              bullet={<CustomAvatar {...vote.user} />}
            >
              <VoteBadge {...vote} />
              <SingleText text={parseTime(vote.createdAt)} />
            </Timeline.Item>
          ))}
        </Timeline>
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.discussions')}>
        <Timeline bulletSize={32}>
          {discussionsResponse.isLoading && (
            <Timeline.Item title={<Skeleton w={64} h={16} />}>
              <Skeleton w={128} h={16} />
              <Skeleton w={128} h={16} />
            </Timeline.Item>
          )}
          {discussions?.map((discussion) => (
            <Timeline.Item
              key={discussion.id}
              title={discussion.user.nick}
              bullet={<CustomAvatar {...discussion.user} />}
            >
              <Group spacing={0} position='apart' align='flex-start' noWrap>
                <div>
                  <SingleText text={discussion.text} />
                  <SingleText text={parseTime(discussion.createdAt)} />
                </div>
                <CustomActions
                  data={discussion}
                  actions={[editDiscussionAction, deleteDiscussionAction]}
                />
              </Group>
            </Timeline.Item>
          ))}
        </Timeline>
      </Input.Wrapper>
      <TextInput
        label={t('columns.result')}
        value={t(`constants.results.${results[poll.result - 1]}`)}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(poll.createdAt)}
        readOnly
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(poll.completedAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewPollAction = {
  open: (poll: Poll) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.polls'),
      children: <ViewPollModal data={poll} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
