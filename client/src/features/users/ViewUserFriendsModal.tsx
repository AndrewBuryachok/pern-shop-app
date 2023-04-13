import { Select, Stack } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ExtUser } from './user.model';
import { UsersItem } from '../../common/components/UsersItem';
import { viewUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<ExtUser>;

export default function ViewUserFriendsModal({ data: user }: Props) {
  return (
    <Stack spacing={8}>
      <Select
        label='Friends'
        placeholder={`Total: ${user.friends.length}`}
        itemComponent={UsersItem}
        data={viewUsers(user.friends)}
        searchable
      />
    </Stack>
  );
}

export const viewUserFriendsAction = {
  open: (user: ExtUser) =>
    openModal({
      title: 'View User Friends',
      children: <ViewUserFriendsModal data={user} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
