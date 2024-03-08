import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useSelectPollViewsQuery } from './polls.api';
import ViewsTimeline from '../../common/components/ViewsTimeline';

type Props = IModal<Poll>;

export default function ViewPollViewsModal({ data: poll }: Props) {
  const response = useSelectPollViewsQuery(poll.id);

  return <ViewsTimeline {...response} />;
}

export const openViewPollViewsModal = (poll: Poll) =>
  openModal({
    title: t('columns.views'),
    children: <ViewPollViewsModal data={poll} />,
  });
