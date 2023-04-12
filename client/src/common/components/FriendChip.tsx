import { Chip } from '@mantine/core';
import { getCurrentUser } from '../../features/auth/auth.slice';
import { User } from '../../features/users/user.model';
import { createFriendButton } from '../../features/friends/CreateFriendModal';

type Props = {
  data?: User;
  small?: boolean;
};

export default function FriendChip(props: Props) {
  const user = getCurrentUser();

  const checked =
    user && props.data?.friends.map((friend) => friend.id).includes(user.id);

  return (
    <Chip
      size={props.small ? 'xs' : 'sm'}
      checked={checked}
      onClick={() => !checked && createFriendButton.open(props.data)}
      disabled={!user || !props.data}
      readOnly
    >
      Friend
    </Chip>
  );
}
