import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Task } from './task.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import PriorityIcon from '../../common/components/PriorityIcon';
import { parseStatus, parseTime } from '../../common/utils';
import { Color, priorities } from '../../common/constants';

type Props = IModal<Task>;

export default function ViewTaskModal({ data: task }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...task.customerUser} />}
        iconWidth={48}
        value={task.customerUser.name}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={task.description}
        disabled
      />
      <TextInput
        label={t('columns.priority')}
        icon={<PriorityIcon {...task} />}
        iconWidth={48}
        value={t('constants.priorities.' + priorities[task.priority - 1])}
        disabled
      />
      <TextInput
        label={t('columns.executor')}
        icon={task.executorUser && <CustomAvatar {...task.executorUser} />}
        iconWidth={48}
        value={task.executorUser ? task.executorUser.name : '-'}
        disabled
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(task.createdAt)}
        disabled
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(task.completedAt)}
        disabled
      />
      <TextInput
        label={t('columns.status')}
        value={parseStatus(task.status)}
        disabled
      />
    </Stack>
  );
}

export const viewTaskAction = {
  open: (task: Task) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.task'),
      children: <ViewTaskModal data={task} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
