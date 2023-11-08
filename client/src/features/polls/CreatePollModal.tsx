import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreatePollMutation } from './polls.api';
import { CreatePollDto } from './poll.dto';
import CustomForm from '../../common/components/CustomForm';
import { MAX_DESCRIPTION_LENGTH } from '../../common/constants';

export default function CreatePollModal() {
  const [t] = useTranslation();

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
      text={t('actions.create') + ' ' + t('modals.poll')}
    >
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        required
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
    </CustomForm>
  );
}

export const createPollButton = {
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.poll'),
      children: <CreatePollModal />,
    }),
};
