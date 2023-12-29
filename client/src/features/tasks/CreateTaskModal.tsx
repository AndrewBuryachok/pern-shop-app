import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateTaskMutation } from './tasks.api';
import { CreateTaskDto } from './task.dto';
import CustomForm from '../../common/components/CustomForm';
import { PrioritiesItem } from '../../common/components/PrioritiesItem';
import { selectPriorities } from '../../common/utils';
import { MAX_TEXT_LENGTH, MAX_TITLE_LENGTH } from '../../common/constants';

export default function CreateTaskModal() {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      title: '',
      text: '',
      priority: '',
    },
    transformValues: ({ priority, ...rest }) => ({
      ...rest,
      priority: +priority,
    }),
  });

  const [createTask, { isLoading }] = useCreateTaskMutation();

  const handleSubmit = async (dto: CreateTaskDto) => {
    await createTask(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.tasks')}
    >
      <TextInput
        label={t('columns.title')}
        placeholder={t('columns.title')}
        required
        maxLength={MAX_TITLE_LENGTH}
        {...form.getInputProps('title')}
      />
      <Textarea
        label={t('columns.text')}
        placeholder={t('columns.text')}
        required
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
      <Select
        label={t('columns.priority')}
        placeholder={t('columns.priority')}
        itemComponent={PrioritiesItem}
        data={selectPriorities()}
        searchable
        required
        {...form.getInputProps('priority')}
      />
    </CustomForm>
  );
}

export const createTaskButton = {
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.tasks'),
      children: <CreateTaskModal />,
    }),
};
