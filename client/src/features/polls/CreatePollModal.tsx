import { Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreatePollMutation } from './polls.api';
import { CreatePollDto } from './poll.dto';
import CustomForm from '../../common/components/CustomForm';
import { MAX_DESCRIPTION_LENGTH } from '../../common/constants';

export default function CreatePollModal() {
  const form = useForm({
    initialValues: {
      description: '',
    },
  });

  const [createPoll, { isLoading }] = useCreatePollMutation();

  const handleSubmit = async (dto: CreatePollDto) => {
    await createPoll(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create poll'}
    >
      <Textarea
        label='Description'
        placeholder='Description'
        required
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
    </CustomForm>
  );
}

export const createPollButton = {
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Poll',
      children: <CreatePollModal />,
    }),
};
