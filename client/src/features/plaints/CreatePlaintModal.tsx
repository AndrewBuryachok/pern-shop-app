import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreatePlaintMutation } from './plaints.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { CreatePlaintDto } from './plaint.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';
import { MAX_DESCRIPTION_LENGTH } from '../../common/constants';

export default function CreatePlaintModal() {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      user: '',
      description: '-',
    },
    transformValues: ({ user, ...rest }) => ({
      ...rest,
      userId: +user,
    }),
  });

  const { data: users, ...usersResponse } = useSelectAllUsersQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [createPlaint, { isLoading }] = useCreatePlaintMutation();

  const handleSubmit = async (dto: CreatePlaintDto) => {
    await createPlaint(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.plaint')}
    >
      <Select
        label={t('columns.receiver')}
        placeholder={t('columns.receiver')}
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
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        required
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
    </CustomForm>
  );
}

export const createPlaintButton = {
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.plaint'),
      children: <CreatePlaintModal />,
    }),
};
