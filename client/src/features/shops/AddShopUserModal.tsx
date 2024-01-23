import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Shop } from './shop.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useAddShopUserMutation, useSelectShopUsersQuery } from './shops.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { UpdateShopUserDto } from './shop.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Shop>;

export default function AddShopUserModal({ data: shop }: Props) {
  const [t] = useTranslation();

  const { data: shopUsers } = useSelectShopUsersQuery(shop.id);

  const form = useForm({
    initialValues: {
      shopId: shop.id,
      user: '',
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  const { data: users, ...usersResponse } = useSelectAllUsersQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [addShopUser, { isLoading }] = useAddShopUserMutation();

  const handleSubmit = async (dto: UpdateShopUserDto) => {
    await addShopUser(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.add') + ' ' + t('modals.users')}
    >
      <TextInput label={t('columns.shop')} value={shop.name} readOnly />
      <Select
        label={t('columns.user')}
        placeholder={t('columns.user')}
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        rightSection={<RefetchAction {...usersResponse} />}
        itemComponent={UsersItem}
        data={selectUsers(users).filter(
          (user) => !shopUsers?.map((user) => user.id).includes(user.id),
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

export const addShopUserFactory = (hasRole: boolean) => ({
  open: (shop: Shop) =>
    openModal({
      title: t('actions.add') + ' ' + t('modals.users'),
      children: <AddShopUserModal data={shop} />,
    }),
  disable: (shop: Shop) => {
    const user = getCurrentUser()!;
    return shop.user.id !== user.id && !hasRole;
  },
  color: Color.GREEN,
});

export const addMyShopUserAction = addShopUserFactory(false);

export const addUserShopUserAction = addShopUserFactory(true);
