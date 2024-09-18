import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useSelectPollLikesQuery } from './polls.api';
import ReactionsTimeline from '../../common/components/ReactionsTimeline';

type Props = IModal<Poll>;

export default function ViewPollLikesModal({ data: poll }: Props) {
  const response = useSelectPollLikesQuery(poll.id);

  return <ReactionsTimeline {...response} />;
}

export const openViewPollLikesModal = (poll: Poll) =>
  openModal({
    title: t('columns.likes'),
    children: <ViewPollLikesModal data={poll} />,
  });
