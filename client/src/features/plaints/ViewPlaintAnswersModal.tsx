import { t } from 'i18next';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Plaint } from './plaint.model';
import { useSelectPlaintAnswersQuery } from './plaints.api';
import RepliesTimeline from '../../common/components/RepliesTimeline';
import { editAnswerAction } from '../answers/EditAnswerModal';
import { deleteAnswerAction } from '../answers/DeleteAnswerModal';

type Props = IModal<Plaint>;

export default function ViewPlaintAnswersModal({ data: plaint }: Props) {
  const response = useSelectPlaintAnswersQuery(plaint.id);

  return (
    <RepliesTimeline
      {...response}
      actions={[editAnswerAction, deleteAnswerAction]}
    />
  );
}

export const openViewPlaintAnswersModal = (plaint: Plaint) =>
  openModal({
    title: t('columns.answers'),
    children: <ViewPlaintAnswersModal data={plaint} />,
  });
