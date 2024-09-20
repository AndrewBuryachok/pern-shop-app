import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import {
  useAddTownUserMutation,
  useSelectMyTownsQuery,
} from '../towns/towns.api';
import { useSelectNotCitizensUsersQuery } from './users.api';
import { UpdateTownUserDto } from '../towns/town.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import { PlacesItem } from '../../common/components/PlacesItem';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectTowns, selectUsers } from '../../common/utils';

export default function AddUserTownModal() {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      user: '',
      town: '',
    },
    transformValues: ({ user, town }) => ({
      userId: +user,
      townId: +town,
    }),
  });

  const { data: users, ...usersResponse } = useSelectNotCitizensUsersQuery();
  const { data: towns, ...townsResponse } = useSelectMyTownsQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [addUserTown, { isLoading }] = useAddTownUserMutation();

  const handleSubmit = async (dto: UpdateTownUserDto) => {
    await addUserTown(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.add') + ' ' + t('modals.users')}
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
      <Select
        label={t('columns.town')}
        placeholder={t('columns.town')}
        rightSection={<RefetchAction {...townsResponse} />}
        itemComponent={PlacesItem}
        data={selectTowns(towns)}
        limit={20}
        searchable
        required
        readOnly={townsResponse.isFetching}
        {...form.getInputProps('town')}
      />
    </CustomForm>
  );
}

export const addUserTownButton = {
  label: 'add',
  open: () =>
    openModal({
      title: t('actions.add') + ' ' + t('modals.users'),
      children: <AddUserTownModal />,
    }),
};
