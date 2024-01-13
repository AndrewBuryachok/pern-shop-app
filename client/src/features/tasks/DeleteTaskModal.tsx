import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Task } from './task.model';
import { useDeleteTaskMutation } from './tasks.api';
import { TaskIdDto } from './task.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import PriorityIcon from '../../common/components/PriorityIcon';
import { Color, priorities, Status } from '../../common/constants';

type Props = IModal<Task>;

export default function DeleteTaskModal({ data: task }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      taskId: task.id,
    },
  });

  const [deleteTask, { isLoading }] = useDeleteTaskMutation();

  const handleSubmit = async (dto: TaskIdDto) => {
    await deleteTask(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.tasks')}
    >
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...task.customerUser} />}
        iconWidth={48}
        value={task.customerUser.nick}
        disabled
      />
      <TextInput label={t('columns.title')} value={task.title} disabled />
      <Textarea label={t('columns.text')} value={task.text} autosize disabled />
      <TextInput
        label={t('columns.priority')}
        icon={<PriorityIcon {...task} />}
        iconWidth={48}
        value={t(`constants.priorities.${priorities[task.priority - 1]}`)}
        disabled
      />
    </CustomForm>
  );
}

export const deleteTaskAction = {
  open: (task: Task) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.tasks'),
      children: <DeleteTaskModal data={task} />,
    }),
  disable: (task: Task) => task.status !== Status.CREATED,
  color: Color.RED,
};
