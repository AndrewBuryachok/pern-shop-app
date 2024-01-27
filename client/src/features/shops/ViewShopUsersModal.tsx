import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Shop } from './shop.model';
import { useSelectShopUsersQuery } from './shops.api';
import RefetchAction from '../../common/components/RefetchAction';
import { UsersItem } from '../../common/components/UsersItem';
import { viewUsers } from '../../common/utils';

type Props = IModal<Shop>;

export default function ViewShopUsersModal({ data: shop }: Props) {
  const [t] = useTranslation();

  const { data: users, ...usersResponse } = useSelectShopUsersQuery(shop.id);

  return (
    <Select
      label={t('columns.users')}
      placeholder={`${t('components.total')}: ${users?.length || 0}`}
      rightSection={<RefetchAction {...usersResponse} />}
      itemComponent={UsersItem}
      data={viewUsers(users || [])}
      limit={20}
      searchable
    />
  );
}

export const openViewShopUsersAction = (shop: Shop) =>
  openModal({
    title: t('columns.users'),
    children: <ViewShopUsersModal data={shop} />,
  });
