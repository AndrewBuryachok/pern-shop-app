import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Select, Stack, TextInput, Textarea } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Shop } from './shop.model';
import { useSelectShopGoodsQuery, useSelectShopUsersQuery } from './shops.api';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import { UsersItem } from '../../common/components/UsersItem';
import { ThingsItemWithAmount } from '../../common/components/ThingsItemWithAmount';
import { parseTime, viewThings, viewUsers } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Shop>;

export default function ViewShopModal({ data: shop }: Props) {
  const [t] = useTranslation();

  const { data: users, ...usersResponse } = useSelectShopUsersQuery(shop.id);
  const { data: goods, ...goodsResponse } = useSelectShopGoodsQuery(shop.id);

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={shop.id} disabled />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...shop.user} />}
        iconWidth={48}
        value={shop.user.nick}
        disabled
      />
      <TextInput label={t('columns.shop')} value={shop.name} disabled />
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={shop.image} />
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.video')}>
        <CustomVideo video={shop.video} />
      </Input.Wrapper>
      <Textarea
        label={t('columns.description')}
        value={shop.description || '-'}
        disabled
      />
      <TextInput label={t('columns.x')} value={shop.x} disabled />
      <TextInput label={t('columns.y')} value={shop.y} disabled />
      <TextInput
        label={t('columns.created')}
        value={parseTime(shop.createdAt)}
        disabled
      />
      <Select
        label={t('columns.users')}
        placeholder={`${t('components.total')}: ${users?.length || 0}`}
        rightSection={<RefetchAction {...usersResponse} />}
        itemComponent={UsersItem}
        data={viewUsers(users || [])}
        limit={20}
        searchable
      />
      <Select
        label={t('columns.goods')}
        placeholder={`${t('components.total')}: ${goods?.length || 0}`}
        rightSection={<RefetchAction {...goodsResponse} />}
        itemComponent={ThingsItemWithAmount}
        data={viewThings(goods || [])}
        limit={20}
        searchable
      />
    </Stack>
  );
}

export const viewShopAction = {
  open: (shop: Shop) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.shops'),
      children: <ViewShopModal data={shop} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
