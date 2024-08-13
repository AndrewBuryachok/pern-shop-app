import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Task } from './task.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseStatus, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Task>;

export default function ViewTaskModal({ data: task }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={task.id} readOnly />
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...task.customerCard.user} />}
        iconWidth={48}
        value={parseCard(task.customerCard)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={task.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${task.price} ${t('constants.currency')}`}
        readOnly
      />
      <TextInput
        label={t('columns.status')}
        value={parseStatus(task.status)}
        readOnly
      />
      <TextInput
        label={t('columns.executor')}
        icon={task.executorCard && <CustomAvatar {...task.executorCard.user} />}
        iconWidth={48}
        value={task.executorCard ? parseCard(task.executorCard) : '-'}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(task.createdAt)}
        readOnly
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(task.completedAt)}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')}>
        <Rating value={task.rate} readOnly />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewTaskAction = {
  open: (task: Task) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.tasks'),
      children: <ViewTaskModal data={task} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
