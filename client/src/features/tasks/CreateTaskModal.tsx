import { Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateTaskMutation } from './tasks.api';
import { CreateTaskDto } from './task.dto';
import CustomForm from '../../common/components/CustomForm';
import { PrioritiesItem } from '../../common/components/PrioritiesItem';
import { selectPriorities } from '../../common/utils';
import { MAX_DESCRIPTION_LENGTH } from '../../common/constants';

export default function CreateTaskModal() {
  const form = useForm({
    initialValues: {
      description: '-',
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
      text={'Create task'}
    >
      <Textarea
        label='Description'
        placeholder='Description'
        required
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
      <Select
        label='Priority'
        placeholder='Priority'
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
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Task',
      children: <CreateTaskModal />,
    }),
};
