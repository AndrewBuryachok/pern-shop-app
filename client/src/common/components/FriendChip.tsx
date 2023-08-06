import { Chip } from '@mantine/core';
import { getCurrentUser } from '../../features/auth/auth.slice';
import { ExtUser } from '../../features/users/user.model';
import { openViewUserModal } from '../../features/users/ViewUserFriendsModal';

type Props = {
  data: ExtUser;
};

export default function FriendChip(props: Props) {
  const user = getCurrentUser();

  const checked =
    !!user && props.data.friends.map((friend) => friend.id).includes(user.id);

  return (
    <Chip
      checked={checked}
      onClick={() => openViewUserModal(props.data)}
      readOnly
    >
      Friend
    </Chip>
  );
}
