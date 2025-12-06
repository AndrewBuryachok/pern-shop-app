import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import {
  useAddUserBannedMutation,
  useSelectNotBannedUsersQuery,
} from './users.api';
import { UserIdDto } from './user.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';

export default function AddUserBannedModal() {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      user: '',
    },
    transformValues: ({ user }) => ({ userId: +user }),
  });

  const { data: users, ...usersResponse } = useSelectNotBannedUsersQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [addUserBanned, { isLoading }] = useAddUserBannedMutation();

  const handleSubmit = async (dto: UserIdDto) => {
    await addUserBanned(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.ban') + ' ' + t('modals.users')}
    >
      <Select
        label={t('columns.user')}
        placeholder={t('columns.user')}
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        rightSection={<RefetchAction {...usersResponse} />}
        itemComponent={UsersItem}
        data={selectUsers(users)}
        limit={20}
        searchable
        required
        readOnly={usersResponse.isFetching}
        {...form.getInputProps('user')}
      />
    </CustomForm>
  );
}

export const addUserBannedButton = {
  label: 'ban',
  open: () =>
    openModal({
      title: t('actions.ban') + ' ' + t('modals.users'),
      children: <AddUserBannedModal />,
    }),
};
