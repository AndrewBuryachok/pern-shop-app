import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { User } from './user.model';
import { useAddUserRoleMutation } from './users.api';
import { UpdateUserRolesDto } from './user.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { selectRoles } from '../../common/utils';
import { Color, roles } from '../../common/constants';

type Props = IModal<User>;

export default function AddUserRoleModal({ data: user }: Props) {
  const form = useForm({
    initialValues: {
      userId: user.id,
      role: '',
    },
    transformValues: ({ role, ...rest }) => ({ ...rest, role: +role }),
  });

  const [addUserRole, { isLoading }] = useAddUserRoleMutation();

  const handleSubmit = async (dto: UpdateUserRolesDto) => {
    await addUserRole(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Add user role'}
    >
      <TextInput
        label='User'
        icon={<CustomAvatar {...user} />}
        iconWidth={48}
        value={user.name}
        disabled
      />
      <Select
        label='Role'
        placeholder='Role'
        data={selectRoles().filter(
          (role) => !user.roles.includes(+role.value) || !role.value,
        )}
        searchable
        required
        {...form.getInputProps('role')}
      />
    </CustomForm>
  );
}

export const addUserRoleAction = {
  open: (user: User) =>
    openModal({
      title: 'Add User Role',
      children: <AddUserRoleModal data={user} />,
    }),
  disable: (user: User) => user.roles.length === roles.length,
  color: Color.GREEN,
};
