import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Friend } from './friend.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useAddFriendMutation } from './friends.api';
import { UpdateFriendDto } from './friend.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color } from '../../common/constants';

type Props = IModal<Friend>;

export default function AddFriendModal({ data: friend }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      friendId: friend.id,
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
        label={t('columns.sender')}
        icon={<CustomAvatar {...friend.senderUser} />}
        iconWidth={48}
        value={friend.senderUser.name}
        disabled
      />
      <TextInput
        label={t('columns.receiver')}
        icon={<CustomAvatar {...friend.receiverUser} />}
        iconWidth={48}
        value={friend.receiverUser.name}
        disabled
      />
    </CustomForm>
  );
}

export const addFriendAction = {
  open: (friend: Friend) =>
    openModal({
      title: t('actions.add') + ' ' + t('modals.friend'),
      children: <AddFriendModal data={friend} />,
    }),
  disable: (friend: Friend) => {
    const user = getCurrentUser()!;
    return friend.senderUser.id === user.id || friend.type;
  },
  color: Color.GREEN,
};
