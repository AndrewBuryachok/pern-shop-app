import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useSelectPollVotesQuery } from './polls.api';
import ReactionsTimeline from '../../common/components/ReactionsTimeline';

type Props = IModal<Poll>;

export default function ViewPollVotesModal({ data: poll }: Props) {
  const response = useSelectPollVotesQuery(poll.id);

  return <ReactionsTimeline {...response} />;
}

export const openViewPollVotesModal = (poll: Poll) =>
  openModal({
    title: t('columns.votes'),
    children: <ViewPollVotesModal data={poll} />,
  });
