import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useAddSubscriberMutation } from './subscribers.api';
import { useSelectNotSubscribedUsersQuery } from '../users/users.api';
import { UpdateSubscriberDto } from './subscriber.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';

export default function AddSubscriberModal() {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      user: '',
    },
    transformValues: ({ user }) => ({
      userId: +user,
    }),
  });

  const { data: users, ...usersResponse } = useSelectNotSubscribedUsersQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [addSubscriber, { isLoading }] = useAddSubscriberMutation();

  const handleSubmit = async (dto: UpdateSubscriberDto) => {
    await addSubscriber(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.add') + ' ' + t('modals.subscribers')}
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

export const addSubscriberButton = {
  label: 'add',
  open: () =>
    openModal({
      title: t('actions.add') + ' ' + t('modals.subscribers'),
      children: <AddSubscriberModal />,
    }),
};
