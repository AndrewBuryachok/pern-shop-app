import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Shop } from './shop.model';
import { getCurrentUser } from '../auth/auth.slice';
import {
  useRemoveShopUserMutation,
  useSelectShopUsersQuery,
} from './shops.api';
import { UpdateShopUserDto } from './shop.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { selectUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Shop>;

export default function RemoveShopUserModal({ data: shop }: Props) {
  const [t] = useTranslation();

  const { data: shopUsers } = useSelectShopUsersQuery(shop.id);

  const form = useForm({
    initialValues: {
      shopId: shop.id,
      user: '',
    },
    transformValues: ({ user, ...rest }) => ({ ...rest, userId: +user }),
  });

  const user = shopUsers?.find((user) => user.id === +form.values.user);

  const [removeShopUser, { isLoading }] = useRemoveShopUserMutation();

  const handleSubmit = async (dto: UpdateShopUserDto) => {
    await removeShopUser(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.remove') + ' ' + t('modals.users')}
    >
      <TextInput label={t('columns.shop')} value={shop.name} disabled />
      <Select
        label={t('columns.user')}
        placeholder={t('columns.user')}
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        itemComponent={UsersItem}
        data={selectUsers(shopUsers).filter((user) => user.id !== shop.user.id)}
        limit={20}
        searchable
        required
        {...form.getInputProps('user')}
      />
    </CustomForm>
  );
}

export const removeShopUserFactory = (hasRole: boolean) => ({
  open: (shop: Shop) =>
    openModal({
      title: t('actions.remove') + ' ' + t('modals.users'),
      children: <RemoveShopUserModal data={shop} />,
    }),
  disable: (shop: Shop) => {
    const user = getCurrentUser()!;
    return (shop.user.id !== user.id && !hasRole) || shop.users === 1;
  },
  color: Color.RED,
});

export const removeMyShopUserAction = removeShopUserFactory(false);

export const removeUserShopUserAction = removeShopUserFactory(true);
