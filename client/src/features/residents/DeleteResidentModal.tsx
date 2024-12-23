import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { User } from '../users/user.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useDeleteResidentMutation } from './residents.api';
import { UserIdDto } from '../users/user.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parsePlace } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<User>;

export default function DeleteResidentModal({ data: user }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      userId: user.id,
    },
  });

  const [deleteResident, { isLoading }] = useDeleteResidentMutation();

  const handleSubmit = async (dto: UserIdDto) => {
    await deleteResident(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.residents')}
    >
      <TextInput
        label={t('columns.user')}
        icon={<CustomAvatar {...user} />}
        iconWidth={48}
        value={user.nick}
        readOnly
      />
      <TextInput
        label={t('columns.town')}
        value={parsePlace(user.town!)}
        readOnly
      />
    </CustomForm>
  );
}

export const deleteResidentAction = {
  open: (user: User) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.residents'),
      children: <DeleteResidentModal data={user} />,
    }),
  disable: (user: User) => {
    const me = getCurrentUser()!;
    return (
      user.town!.user.id === user.id ||
      (user.town!.user.id !== me.id && user.id !== me.id)
    );
  },
  color: Color.RED,
};
