import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { User } from './user.model';
import { useEditUserPasswordMutation } from './users.api';
import { EditUserPasswordDto } from './user.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import {
  Color,
  MAX_TEXT_LENGTH,
  MIN_TEXT_LENGTH,
} from '../../common/constants';

type Props = IModal<User>;

export default function EditUserPasswordModal({ data: user }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      userId: user.id,
      password: '',
    },
  });

  const [editUserPassword, { isLoading }] = useEditUserPasswordMutation();

  const handleSubmit = async (dto: EditUserPasswordDto) => {
    await editUserPassword(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={
        t('actions.edit') + ' ' + t('columns.password') + ' ' + t('modals.user')
      }
    >
      <TextInput
        label={t('columns.user')}
        icon={<CustomAvatar {...user} />}
        iconWidth={48}
        value={user.name}
        disabled
      />
      <PasswordInput
        label={t('columns.password')}
        placeholder={t('columns.password')}
        required
        minLength={MIN_TEXT_LENGTH}
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('password')}
      />
    </CustomForm>
  );
}

export const editUserPasswordAction = {
  open: (user: User) =>
    openModal({
      title:
        t('actions.edit') +
        ' ' +
        t('columns.password') +
        ' ' +
        t('modals.user'),
      children: <EditUserPasswordModal data={user} />,
    }),
  disable: () => false,
  color: Color.YELLOW,
};
