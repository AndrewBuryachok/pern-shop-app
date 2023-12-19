import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Select, Stack, TextInput, Textarea } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Shop } from './shop.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import { ThingsItem } from '../../common/components/ThingsItem';
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
        value={shop.user.nick}
        disabled
      />
      <TextInput label={t('columns.shop')} value={shop.name} disabled />
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage {...shop} />
      </Input.Wrapper>
      <Textarea
        label={t('columns.description')}
        value={shop.description || '-'}
        disabled
      />
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
