import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateRatingMutation } from './ratings.api';
import { useSelectNotRatedUsersQuery } from '../users/users.api';
import { CreateRatingDto } from './rating.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';

export default function CreateRatingModal() {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      user: '',
      rate: 5,
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  const { data: users, ...usersResponse } = useSelectNotRatedUsersQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [createRating, { isLoading }] = useCreateRatingMutation();

  const handleSubmit = async (dto: CreateRatingDto) => {
    await createRating(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.ratings')}
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
      <Input.Wrapper label={t('columns.rate')} required>
        <Rating {...form.getInputProps('rate')} />
      </Input.Wrapper>
    </CustomForm>
  );
}

export const createRatingButton = {
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.ratings'),
      children: <CreateRatingModal />,
    }),
};
