import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Farm } from './farm.model';
import { getCurrentUser } from '../auth/auth.slice';
import {
  useRemoveFarmUserMutation,
  useSelectFarmUsersQuery,
} from './farms.api';
import { UpdateFarmUserDto } from './farm.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Farm>;

export default function RemoveFarmUserModal({ data: farm }: Props) {
  const [t] = useTranslation();

  const { data: farmUsers } = useSelectFarmUsersQuery(farm.id);

  const form = useForm({
    initialValues: {
      farmId: farm.id,
      user: '',
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  const user = farmUsers?.find((user) => user.id === +form.values.user);

  const [removeFarmUser, { isLoading }] = useRemoveFarmUserMutation();

  const handleSubmit = async (dto: UpdateFarmUserDto) => {
    await removeFarmUser(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.remove') + ' ' + t('modals.users')}
    >
      <TextInput label={t('columns.farm')} value={farm.name} readOnly />
      <Select
        label={t('columns.user')}
        placeholder={t('columns.user')}
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        itemComponent={UsersItem}
        data={selectUsers(farmUsers).filter((user) => user.id !== farm.user.id)}
        limit={20}
        searchable
        required
        {...form.getInputProps('user')}
      />
    </CustomForm>
  );
}

export const removeFarmUserFactory = (hasRole: boolean) => ({
  open: (farm: Farm) =>
    openModal({
      title: t('actions.remove') + ' ' + t('modals.users'),
      children: <RemoveFarmUserModal data={farm} />,
    }),
  disable: (farm: Farm) => {
    const user = getCurrentUser()!;
    return (farm.user.id !== user.id && !hasRole) || farm.users === 1;
  },
  color: Color.RED,
});

export const removeMyFarmUserAction = removeFarmUserFactory(false);

export const removeUserFarmUserAction = removeFarmUserFactory(true);
