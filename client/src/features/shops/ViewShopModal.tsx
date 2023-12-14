import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Shop } from './shop.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { ThingsItem } from '../../common/components/ThingItem';
import { viewThings } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Shop>;

export default function ViewShopModal({ data: shop }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={shop.id} disabled />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...shop.user} />}
        iconWidth={48}
        value={shop.user.name}
        disabled
      />
      <TextInput label={t('columns.shop')} value={shop.name} disabled />
      <TextInput label={t('columns.x')} value={shop.x} disabled />
      <TextInput label={t('columns.y')} value={shop.y} disabled />
      <Select
        label={t('columns.goods')}
        placeholder={`${t('components.total')}: ${shop.goods.length}`}
        itemComponent={ThingsItem}
        data={viewThings(shop.goods)}
        limit={20}
        searchable
      />
    </Stack>
  );
}

export const viewShopAction = {
  open: (shop: Shop) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.shop'),
      children: <ViewShopModal data={shop} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
