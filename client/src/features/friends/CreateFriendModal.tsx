import { Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { User } from '../users/user.model';
import { useCreateFriendMutation } from './friends.api';
import { useSelectNotFriendsUsersQuery } from '../users/users.api';
import { CreateFriendDto } from './friend.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';

type Props = {
  data?: User;
};

export default function CreateFriendModal({ data }: Props) {
  const form = useForm({
    initialValues: {
      user: data?.id ? `${data.id}` : '',
    },
    transformValues: ({ user }) => ({
      userId: +user,
    }),
  });

  const { data: users, ...usersResponse } = useSelectNotFriendsUsersQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [createFriend, { isLoading }] = useCreateFriendMutation();

  const handleSubmit = async (dto: CreateFriendDto) => {
    await createFriend(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create friend'}
    >
      <Select
        label='User'
        placeholder='User'
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        rightSection={<RefetchAction {...usersResponse} />}
        itemComponent={UsersItem}
        data={selectUsers(users)}
        searchable
        required
        disabled={usersResponse.isFetching}
        {...form.getInputProps('user')}
      />
    </CustomForm>
  );
}

export const createFriendButton = {
  label: 'Create',
  open: (user?: User) =>
    openModal({
      title: 'Create Friend',
      children: <CreateFriendModal data={user} />,
    }),
};
