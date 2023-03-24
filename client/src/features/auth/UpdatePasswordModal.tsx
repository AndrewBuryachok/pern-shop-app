import { PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useUpdatePasswordMutation } from './auth.api';
import { UpdatePasswordDto } from './auth.dto';
import CustomForm from '../../common/components/CustomForm';
import { MAX_TEXT_LENGTH, MIN_TEXT_LENGTH } from '../../common/constants';

export default function UpdatePasswordModal() {
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
      text={'Update password'}
    >
      <PasswordInput
        label='Old Password'
        placeholder='Old Password'
        required
        minLength={MIN_TEXT_LENGTH}
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('oldPassword')}
      />
      <PasswordInput
        label='New Password'
        placeholder='New Password'
        required
        minLength={MIN_TEXT_LENGTH}
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('newPassword')}
      />
    </CustomForm>
  );
}

export const openUpdatePasswordModal = () =>
  openModal({ title: 'Update Password', children: <UpdatePasswordModal /> });
