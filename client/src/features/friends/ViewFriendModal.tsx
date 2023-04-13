import { Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Friend } from './friend.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseDate } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Friend>;

export default function ViewFriendModal({ data: friend }: Props) {
  const created = parseDate(friend.createdAt);

  return (
    <Stack spacing={8}>
      <TextInput
        label='Sender'
        icon={<CustomAvatar {...friend.senderUser} />}
        iconWidth={48}
        value={friend.senderUser.name}
        disabled
      />
      <TextInput
        label='Receiver'
        icon={<CustomAvatar {...friend.receiverUser} />}
        iconWidth={48}
        value={friend.receiverUser.name}
        disabled
      />
      <TextInput
        label='Type'
        value={friend.type ? 'confirmed' : 'unconfirmed'}
        disabled
      />
      <TextInput
        label='Created'
        value={`${created.date} ${created.time}`}
        disabled
      />
    </Stack>
  );
}

export const viewFriendAction = {
  open: (friend: Friend) =>
    openModal({
      title: 'View Friend',
      children: <ViewFriendModal data={friend} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
