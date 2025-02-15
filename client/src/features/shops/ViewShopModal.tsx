import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Shop } from './shop.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Shop>;

export default function ViewShopModal({ data: shop }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={shop.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...shop.card.user} />}
        iconWidth={48}
        value={parseCard(shop.card)}
        readOnly
      />
      <TextInput label={t('columns.shop')} value={shop.name} readOnly />
      <Textarea
        label={t('columns.description')}
        value={shop.description || '-'}
        readOnly
      />
      <TextInput label={t('columns.x')} value={shop.x} readOnly />
      <TextInput label={t('columns.y')} value={shop.y} readOnly />
      <TextInput
        label={t('columns.created')}
        value={parseTime(shop.createdAt)}
        readOnly
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
