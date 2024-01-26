import { t } from 'i18next';
import { Skeleton, Timeline } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useSelectPollVotesQuery } from './polls.api';
import CustomAvatar from '../../common/components/CustomAvatar';
import VoteBadge from '../../common/components/VoteBadge';
import SingleText from '../../common/components/SingleText';
import { parseTime } from '../../common/utils';

type Props = IModal<Poll>;

export default function ViewPollVotesModal({ data: poll }: Props) {
  const { data: votes, ...votesResponse } = useSelectPollVotesQuery(poll.id);

  return (
    <Timeline bulletSize={32}>
      {votesResponse.isLoading && (
        <Timeline.Item title={<Skeleton w={64} h={16} />}>
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
  );
}

export const openViewPollVotesModal = (poll: Poll) =>
  openModal({
    title: t('columns.votes'),
    children: <ViewPollVotesModal data={poll} />,
  });
