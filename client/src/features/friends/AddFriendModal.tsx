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
      text={'Add friend'}
    >
      <TextInput
        label='Sender User'
        icon={<CustomAvatar {...friend.senderUser} />}
        iconWidth={48}
        value={friend.senderUser.name}
        disabled
      />
      <TextInput
        label='Receiver User'
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
      title: 'Add Friend',
      children: <AddFriendModal data={friend} />,
    }),
  disable: (friend: Friend) => {
    const user = getCurrentUser()!;
    return friend.senderUser.id === user.id || friend.type;
  },
  color: Color.GREEN,
};
