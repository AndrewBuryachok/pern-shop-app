import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Farm } from './farm.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useAddFarmUserMutation, useSelectFarmUsersQuery } from './farms.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { UpdateFarmUserDto } from './farm.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Farm>;

export default function AddFarmUserModal({ data: farm }: Props) {
  const [t] = useTranslation();

  const { data: farmUsers } = useSelectFarmUsersQuery(farm.id);

  const form = useForm({
    initialValues: {
      farmId: farm.id,
      user: '',
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  const { data: users, ...usersResponse } = useSelectAllUsersQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [addFarmUser, { isLoading }] = useAddFarmUserMutation();

  const handleSubmit = async (dto: UpdateFarmUserDto) => {
    await addFarmUser(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.add') + ' ' + t('modals.users')}
    >
      <TextInput label={t('columns.farm')} value={farm.name} readOnly />
      <Select
        label={t('columns.user')}
        placeholder={t('columns.user')}
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        rightSection={<RefetchAction {...usersResponse} />}
        itemComponent={UsersItem}
        data={selectUsers(users).filter(
          (user) => !farmUsers?.map((user) => user.id).includes(user.id),
        )}
        limit={20}
        searchable
        required
        readOnly={usersResponse.isFetching}
        {...form.getInputProps('user')}
      />
    </CustomForm>
  );
}

export const addFarmUserFactory = (hasRole: boolean) => ({
  open: (farm: Farm) =>
    openModal({
      title: t('actions.add') + ' ' + t('modals.users'),
      children: <AddFarmUserModal data={farm} />,
    }),
  disable: (farm: Farm) => {
    const user = getCurrentUser()!;
    return farm.user.id !== user.id && !hasRole;
  },
  color: Color.GREEN,
});

export const addMyFarmUserAction = addFarmUserFactory(false);

export const addUserFarmUserAction = addFarmUserFactory(true);
