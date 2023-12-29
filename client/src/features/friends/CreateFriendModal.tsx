import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useAddFriendMutation } from './friends.api';
import { useSelectNotFriendsUsersQuery } from '../users/users.api';
import { UpdateFriendDto } from './friend.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';

export default function CreateFriendModal() {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      user: '',
    },
    transformValues: ({ user }) => ({
      userId: +user,
    }),
  });

  const { data: users, ...usersResponse } = useSelectNotFriendsUsersQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [addFriend, { isLoading }] = useAddFriendMutation();

  const handleSubmit = async (dto: UpdateFriendDto) => {
    await addFriend(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.add') + ' ' + t('modals.friends')}
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
        disabled={usersResponse.isFetching}
        {...form.getInputProps('user')}
      />
    </CustomForm>
  );
}

export const createFriendButton = {
  label: 'add',
  open: () =>
    openModal({
      title: t('actions.add') + ' ' + t('modals.friends'),
      children: <CreateFriendModal />,
    }),
};
