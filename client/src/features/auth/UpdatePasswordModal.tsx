import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useUpdatePasswordMutation } from './auth.api';
import { UpdatePasswordDto } from './auth.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../../common/constants';

export default function UpdatePasswordModal() {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
    },
  });

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const handleSubmit = async (dto: UpdatePasswordDto) => {
    await updatePassword(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.update') + ' ' + t('columns.password')}
    >
      <PasswordInput
        label={t('columns.oldpassword')}
        placeholder={t('columns.oldpassword')}
        required
        minLength={MIN_PASSWORD_LENGTH}
        maxLength={MAX_PASSWORD_LENGTH}
        {...form.getInputProps('oldPassword')}
      />
      <PasswordInput
        label={t('columns.newpassword')}
        placeholder={t('columns.newpassword')}
        required
        minLength={MIN_PASSWORD_LENGTH}
        maxLength={MAX_PASSWORD_LENGTH}
        {...form.getInputProps('newPassword')}
      />
    </CustomForm>
  );
}

export const openUpdatePasswordModal = () =>
  openModal({
    title: t('actions.update') + ' ' + t('columns.password'),
    children: <UpdatePasswordModal />,
  });
