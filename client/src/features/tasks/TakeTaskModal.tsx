import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Task } from './task.model';
import { useTakeTaskMutation } from './tasks.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { TaskIdDto } from './task.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import PriorityIcon from '../../common/components/PriorityIcon';
import { Color, priorities, Status } from '../../common/constants';

type Props = IModal<Task>;

export default function TakeTaskModal({ data: task }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      taskId: task.id,
    },
  });

  const { data: cards, ...cardsResponse } = useSelectMyCardsQuery();

  const [takeTask, { isLoading }] = useTakeTaskMutation();

  const handleSubmit = async (dto: TaskIdDto) => {
    await takeTask(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.take') + ' ' + t('modals.tasks')}
    >
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...task.customerUser} />}
        iconWidth={48}
        value={task.customerUser.nick}
        disabled
      />
      <TextInput label={t('columns.title')} value={task.title} disabled />
      <Textarea label={t('columns.text')} value={task.text} disabled />
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

export const takeTaskAction = {
  open: (task: Task) =>
    openModal({
      title: t('actions.take') + ' ' + t('modals.tasks'),
      children: <TakeTaskModal data={task} />,
    }),
  disable: (task: Task) => task.status !== Status.CREATED,
  color: Color.GREEN,
};
