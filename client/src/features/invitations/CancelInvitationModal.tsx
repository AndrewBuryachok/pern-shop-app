import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { User } from '../users/user.model';
import { useCancelInvitationMutation } from './invitations.api';
import { UserIdDto } from '../users/user.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color } from '../../common/constants';

type Props = IModal<User>;

export default function CancelInvitationModal({ data: user }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      userId: user.id,
    },
  });

  const [cancelInvitation, { isLoading }] = useCancelInvitationMutation();

  const handleSubmit = async (dto: UserIdDto) => {
    await cancelInvitation(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.cancel') + ' ' + t('modals.invitations')}
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

export const cancelInvitationAction = {
  open: (user: User) =>
    openModal({
      title: t('actions.cancel') + ' ' + t('modals.invitations'),
      children: <CancelInvitationModal data={user} />,
    }),
  disable: () => false,
  color: Color.RED,
};
