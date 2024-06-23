import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import {
  useSelectPollDownVotesQuery,
  useSelectPollUpVotesQuery,
} from './polls.api';
import ReactionsTimeline from '../../common/components/ReactionsTimeline';

type Props = IModal<Poll> & { type: boolean };

export default function ViewPollVotesModal({ data: poll, type }: Props) {
  const response = (
    type ? useSelectPollUpVotesQuery : useSelectPollDownVotesQuery
  )(poll.id);

  return <ReactionsTimeline {...response} />;
}

export const openViewPollVotesModal = (poll: Poll, type: boolean) =>
  openModal({
    title: t('columns.votes'),
    children: <ViewPollVotesModal data={poll} type={type} />,
  });
