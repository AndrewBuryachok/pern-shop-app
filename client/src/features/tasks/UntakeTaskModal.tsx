import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Task } from './task.model';
import { useUntakeTaskMutation } from './tasks.api';
import { TaskIdDto } from './task.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseItem, parseThingAmount } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Task>;

export default function UntakeTaskModal({ data: task }: Props) {
  const [t] = useTranslation();

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
      text={t('actions.untake') + ' ' + t('modals.tasks')}
    >
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...task.customerUser} />}
        iconWidth={48}
        value={task.customerUser.nick}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...task} />}
        iconWidth={48}
        value={parseItem(task.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={task.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(task)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${task.price} ${t('constants.currency')}`}
        readOnly
      />
    </CustomForm>
  );
}

export const untakeTaskAction = {
  open: (task: Task) =>
    openModal({
      title: t('actions.untake') + ' ' + t('modals.tasks'),
      children: <UntakeTaskModal data={task} />,
    }),
  disable: (task: Task) => task.status !== Status.TAKEN,
  color: Color.RED,
};
