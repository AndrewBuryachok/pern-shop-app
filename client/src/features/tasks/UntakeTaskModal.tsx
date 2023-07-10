import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Task } from './task.model';
import { useUntakeTaskMutation } from '../tasks/tasks.api';
import { TaskIdDto } from '../tasks/task.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import PriorityIcon from '../../common/components/PriorityIcon';
import { Color, priorities, Status } from '../../common/constants';

type Props = IModal<Task>;

export default function UntakeTaskModal({ data: task }: Props) {
  const form = useForm({
    initialValues: {
      taskId: task.id,
    },
  });

  const [untakeTask, { isLoading }] = useUntakeTaskMutation();

  const handleSubmit = async (dto: TaskIdDto) => {
    await untakeTask(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Untake task'}
    >
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
        icon={<CustomAvatar {...task.executorUser!} />}
        iconWidth={48}
        value={task.executorUser!.name}
        disabled
      />
    </CustomForm>
  );
}

export const untakeTaskAction = {
  open: (task: Task) =>
    openModal({
      title: 'Untake Task',
      children: <UntakeTaskModal data={task} />,
    }),
  disable: (task: Task) => task.status !== Status.TAKEN,
  color: Color.RED,
};
