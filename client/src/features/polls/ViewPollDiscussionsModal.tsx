import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useSelectPollDiscussionsQuery } from './polls.api';
import RepliesTimeline from '../../common/components/RepliesTimeline';
import { editDiscussionAction } from '../discussions/EditDiscussionModal';
import { deleteDiscussionAction } from '../discussions/DeleteDiscussionModal';

type Props = IModal<Poll>;

export default function ViewPollDiscussionsModal({ data: poll }: Props) {
  const response = useSelectPollDiscussionsQuery(poll.id);

  return (
    <RepliesTimeline
      {...response}
      actions={[editDiscussionAction, deleteDiscussionAction]}
    />
  );
}

export const openViewPollDiscussionsModal = (poll: Poll) =>
  openModal({
    title: t('columns.discussions'),
    children: <ViewPollDiscussionsModal data={poll} />,
  });
