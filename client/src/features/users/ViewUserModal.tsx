import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { User } from './user.model';
import { parsePlace, viewCards, viewRoles } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<User>;

export default function ViewUserModal({ data: user }: Props) {
  return (
    <Stack spacing={8}>
      <TextInput label='User' value={user.name} disabled />
      <Select
        label='Roles'
        placeholder='Roles'
        data={viewRoles(user.roles)}
        searchable
      />
      <TextInput
        label='City'
        value={user.city ? parsePlace(user.city) : '-'}
        disabled
      />
      <Select
        label='Cards'
        placeholder='Cards'
        data={viewCards(user.cards)}
        searchable
      />
    </Stack>
  );
}

export const viewUserAction = {
  open: (user: User) =>
    openModal({
      title: 'View User',
      children: <ViewUserModal data={user} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
