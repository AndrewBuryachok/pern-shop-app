import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useAddFollowingMutation } from './followings.api';
import { useSelectNotFollowingsUsersQuery } from '../users/users.api';
import { UpdateFollowingDto } from './following.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';

export default function AddFollowingModal() {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      user: '',
    },
    transformValues: ({ user }) => ({
      userId: +user,
    }),
  });

  const { data: users, ...usersResponse } = useSelectNotFollowingsUsersQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [addFollowing, { isLoading }] = useAddFollowingMutation();

  const handleSubmit = async (dto: UpdateFollowingDto) => {
    await addFollowing(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.add') + ' ' + t('modals.following')}
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

export const addFollowingButton = {
  label: 'add',
  open: () =>
    openModal({
      title: t('actions.add') + ' ' + t('modals.following'),
      children: <AddFollowingModal />,
    }),
};
