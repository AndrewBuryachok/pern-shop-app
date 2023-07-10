import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Task } from './task.model';
import { useTakeTaskMutation } from '../tasks/tasks.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { TakeTaskDto } from '../tasks/task.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import PriorityIcon from '../../common/components/PriorityIcon';
import { Color, priorities } from '../../common/constants';

type Props = IModal<Task>;

export default function TakeTaskModal({ data: task }: Props) {
  const form = useForm({
    initialValues: {
      taskId: task.id,
    },
  });

  const { data: cards, ...cardsResponse } = useSelectMyCardsQuery();

  const [takeTask, { isLoading }] = useTakeTaskMutation();

  const handleSubmit = async (dto: TakeTaskDto) => {
    await takeTask(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Take task'}
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
    </CustomForm>
  );
}

export const takeTaskAction = {
  open: (task: Task) =>
    openModal({
      title: 'Take Task',
      children: <TakeTaskModal data={task} />,
    }),
  disable: (task: Task) => !!task.executorUser,
  color: Color.GREEN,
};
