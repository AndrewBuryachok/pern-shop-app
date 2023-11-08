import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Task } from './task.model';
import { useExecuteTaskMutation } from '../tasks/tasks.api';
import { TaskIdDto } from '../tasks/task.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import PriorityIcon from '../../common/components/PriorityIcon';
import { Color, priorities, Status } from '../../common/constants';

type Props = IModal<Task>;

export default function ExecuteTaskModal({ data: task }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      taskId: task.id,
    },
  });

  const [executeTask, { isLoading }] = useExecuteTaskMutation();

  const handleSubmit = async (dto: TaskIdDto) => {
    await executeTask(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.execute') + ' ' + t('modals.task')}
    >
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
        label={t('columns.executor')}
        icon={<CustomAvatar {...task.executorUser!} />}
        iconWidth={48}
        value={task.executorUser!.name}
        disabled
      />
      <TextInput
        label={t('columns.priority')}
        icon={<PriorityIcon {...task} />}
        iconWidth={48}
        value={t('constants.priorities.' + priorities[task.priority - 1])}
        disabled
      />
    </CustomForm>
  );
}

export const executeTaskAction = {
  open: (task: Task) =>
    openModal({
      title: t('actions.execute') + ' ' + t('modals.task'),
      children: <ExecuteTaskModal data={task} />,
    }),
  disable: (task: Task) => task.status !== Status.TAKEN,
  color: Color.GREEN,
};
