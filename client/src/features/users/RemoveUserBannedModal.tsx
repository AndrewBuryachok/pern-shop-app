import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { User } from './user.model';
import { useRemoveUserBannedMutation } from './users.api';
import { UserIdDto } from './user.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color } from '../../common/constants';

type Props = IModal<User>;

export default function RemoveUserBannedModal({ data: user }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      userId: user.id,
    },
  });

  const [removeUserBanned, { isLoading }] = useRemoveUserBannedMutation();

  const handleSubmit = async (dto: UserIdDto) => {
    await removeUserBanned(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.unban') + ' ' + t('modals.users')}
    >
      <TextInput
        label={t('columns.user')}
        icon={<CustomAvatar {...user} />}
        iconWidth={48}
        value={user.nick}
        readOnly
      />
    </CustomForm>
  );
}

export const removeUserBannedAction = {
  open: (user: User) =>
    openModal({
      title: t('actions.unban') + ' ' + t('modals.users'),
      children: <RemoveUserBannedModal data={user} />,
    }),
  disable: () => false,
  color: Color.RED,
};
