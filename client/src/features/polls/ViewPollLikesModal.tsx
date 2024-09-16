import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import {
  useSelectPollDownLikesQuery,
  useSelectPollUpLikesQuery,
} from './polls.api';
import ReactionsTimeline from '../../common/components/ReactionsTimeline';

type Props = IModal<Poll> & { type: boolean };

export default function ViewPollLikesModal({ data: poll, type }: Props) {
  const response = (
    type ? useSelectPollUpLikesQuery : useSelectPollDownLikesQuery
  )(poll.id);

  return <ReactionsTimeline {...response} />;
}

export const openViewPollLikesModal = (poll: Poll, type: boolean) =>
  openModal({
    title: t('columns.likes'),
    children: <ViewPollLikesModal data={poll} type={type} />,
  });
