import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Task } from './task.model';
import { useEditTaskMutation } from './tasks.api';
import { EditTaskDto } from './task.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  Color,
  MAX_ACTIVITY_LENGTH,
  MAX_PRICE_VALUE,
  MAX_TEXT_LENGTH,
  Status,
} from '../../common/constants';

type Props = IModal<Task>;

export default function EditTaskModal({ data: task }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      taskId: task.id,
      activity: task.activity,
      text: task.text,
      price: task.price,
    },
  });

  const [editTask, { isLoading }] = useEditTaskMutation();

  const handleSubmit = async (dto: EditTaskDto) => {
    await editTask(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.tasks')}
      isChanged={!form.isDirty()}
    >
      <Textarea
        label={t('columns.activity')}
        placeholder={t('columns.activity')}
        required
        maxLength={MAX_ACTIVITY_LENGTH}
        {...form.getInputProps('activity')}
      />
      <Textarea
        label={t('columns.text')}
        placeholder={t('columns.text')}
        required
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
      <NumberInput
        label={t('columns.price')}
        placeholder={t('columns.price')}
        required
        min={1}
        max={MAX_PRICE_VALUE}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const editTaskAction = {
  open: (task: Task) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.tasks'),
      children: <EditTaskModal data={task} />,
    }),
  disable: (task: Task) => task.status !== Status.CREATED,
  color: Color.YELLOW,
};
