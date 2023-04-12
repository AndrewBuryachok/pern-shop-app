import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Friend } from './friend.model';
import { useRemoveFriendMutation } from './friends.api';
import { UpdateFriendDto } from './friend.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color } from '../../common/constants';

type Props = IModal<Friend>;

export default function RemoveFriendModal({ data: friend }: Props) {
  const form = useForm({
    initialValues: {
      friendId: friend.id,
    },
  });

  const [removeFriend, { isLoading }] = useRemoveFriendMutation();

  const handleSubmit = async (dto: UpdateFriendDto) => {
    await removeFriend(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Remove friend'}
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

export const removeFriendAction = {
  open: (friend: Friend) =>
    openModal({
      title: 'Remove Friend',
      children: <RemoveFriendModal data={friend} />,
    }),
  disable: () => false,
  color: Color.RED,
};
