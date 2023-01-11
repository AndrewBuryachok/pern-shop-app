import { NativeSelect, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { User } from './user.model';
import { useRemoveUserRoleMutation } from './users.api';
import { UpdateUserRolesDto } from './user.dto';
import CustomForm from '../../common/components/CustomForm';
import { selectRoles } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<User>;

export default function RemoveUserRoleModal({ data: user }: Props) {
  const form = useForm({
    initialValues: {
      userId: user.id,
      role: '',
    },
    transformValues: ({ role, ...rest }) => ({ ...rest, role: +role }),
  });

  const [removeUserRole, { isLoading }] = useRemoveUserRoleMutation();

  const handleSubmit = async (dto: UpdateUserRolesDto) => {
    await removeUserRole(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Remove user role'}
    >
      <TextInput label='User' value={user.name} disabled />
      <NativeSelect
        label='Role'
        data={selectRoles().filter(
          (role) => user.roles.includes(+role.value) || !role.value,
        )}
        required
        {...form.getInputProps('role')}
      />
    </CustomForm>
  );
}

export const removeUserRoleAction = {
  open: (user: User) =>
    openModal({
      title: 'Remove User Role',
      children: <RemoveUserRoleModal data={user} />,
    }),
  disable: (user: User) => user.roles.length === 0,
  color: Color.RED,
};
