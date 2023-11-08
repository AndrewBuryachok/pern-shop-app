import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { User } from './user.model';
import { useAddUserRoleMutation } from './users.api';
import { UpdateUserRoleDto } from './user.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { ColorsItem } from '../../common/components/ColorsItem';
import { selectRoles } from '../../common/utils';
import { Color, roles } from '../../common/constants';

type Props = IModal<User>;

export default function AddUserRoleModal({ data: user }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      userId: user.id,
      role: '',
    },
    transformValues: ({ role, ...rest }) => ({ ...rest, role: +role }),
  });

  const [addUserRole, { isLoading }] = useAddUserRoleMutation();

  const handleSubmit = async (dto: UpdateUserRoleDto) => {
    await addUserRole(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.add') + ' ' + t('columns.role') + ' ' + t('modals.user')}
    >
      <TextInput
        label={t('columns.user')}
        icon={<CustomAvatar {...user} />}
        iconWidth={48}
        value={user.name}
        disabled
      />
      <Select
        label={t('columns.role')}
        placeholder={t('columns.role')}
        itemComponent={ColorsItem}
        data={selectRoles().filter((role) => !user.roles.includes(+role.value))}
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
      title:
        t('actions.add') + ' ' + t('columns.role') + ' ' + t('modals.user'),
      children: <AddUserRoleModal data={user} />,
    }),
  disable: (user: User) => user.roles.length === roles.length,
  color: Color.GREEN,
};
