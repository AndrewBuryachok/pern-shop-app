import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { User } from '../users/user.model';
import { useAddFriendMutation } from './friends.api';
import { UpdateFriendDto } from './friend.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color } from '../../common/constants';

type Props = IModal<User>;

export default function AddFriendModal({ data: user }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      userId: user.id,
    },
  });

  const [addFriend, { isLoading }] = useAddFriendMutation();

  const handleSubmit = async (dto: UpdateFriendDto) => {
    await addFriend(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.add') + ' ' + t('modals.friend')}
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

export const addFriendAction = {
  open: (user: User) =>
    openModal({
      title: t('actions.add') + ' ' + t('modals.friend'),
      children: <AddFriendModal data={user} />,
    }),
  disable: () => false,
  color: Color.GREEN,
};
