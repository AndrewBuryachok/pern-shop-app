import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreatePollMutation } from './polls.api';
import { CreatePollDto } from './poll.dto';
import CustomForm from '../../common/components/CustomForm';
import { MAX_TEXT_LENGTH, MAX_TITLE_LENGTH } from '../../common/constants';

export default function CreatePollModal() {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      title: '',
      text: '',
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
