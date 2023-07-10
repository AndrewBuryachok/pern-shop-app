import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Task } from './task.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import PriorityIcon from '../../common/components/PriorityIcon';
import { parseDate } from '../../common/utils';
import { Color, priorities } from '../../common/constants';

type Props = IModal<Task>;

export default function ViewTaskModal({ data: task }: Props) {
  const created = parseDate(task.createdAt);
  const completed = task.completedAt && parseDate(task.completedAt);

  return (
    <Stack spacing={8}>
      <TextInput
        label='Customer'
        icon={<CustomAvatar {...task.customerUser} />}
        iconWidth={48}
        value={task.customerUser.name}
        disabled
      />
      <Textarea label='Description' value={task.description} disabled />
      <TextInput
        label='Priority'
        icon={<PriorityIcon {...task} />}
        iconWidth={48}
        value={priorities[task.priority - 1]}
        disabled
      />
      <TextInput
        label='Executor'
        icon={task.executorUser && <CustomAvatar {...task.executorUser} />}
        iconWidth={48}
        value={task.executorUser ? task.executorUser.name : '-'}
        disabled
      />
      <TextInput
        label='Created'
        value={`${created.date} ${created.time}`}
        disabled
      />
      <TextInput
        label='Completed'
        value={completed ? `${completed.date} ${completed.time}` : '-'}
        disabled
      />
    </Stack>
  );
}

export const viewTaskAction = {
  open: (task: Task) =>
    openModal({
      title: 'View Task',
      children: <ViewTaskModal data={task} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
