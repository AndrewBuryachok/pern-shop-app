import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { User } from '../users/user.model';
import { useRemoveFollowingMutation } from './followings.api';
import { UpdateFollowingDto } from './following.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color } from '../../common/constants';

type Props = IModal<User>;

export default function RemoveFollowingModal({ data: user }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      userId: user.id,
    },
  });

  const [removeFollowing, { isLoading }] = useRemoveFollowingMutation();

  const handleSubmit = async (dto: UpdateFollowingDto) => {
    await removeFollowing(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.remove') + ' ' + t('modals.following')}
    >
      <TextInput
        label={t('columns.user')}
        icon={<CustomAvatar {...user} />}
        iconWidth={48}
        value={user.nick}
        disabled
      />
    </CustomForm>
  );
}

export const removeFollowingAction = {
  open: (user: User) =>
    openModal({
      title: t('actions.remove') + ' ' + t('modals.following'),
      children: <RemoveFollowingModal data={user} />,
    }),
  disable: () => false,
  color: Color.RED,
};
