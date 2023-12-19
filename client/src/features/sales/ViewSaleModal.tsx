import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Sale } from './sale.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseCell,
  parseItem,
  parseSaleAmount,
  parseTime,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Sale>;

export default function ViewSaleModal({ data: sale }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={sale.id} disabled />
      <TextInput
        label={t('columns.buyer')}
        icon={<CustomAvatar {...sale.card.user} />}
        iconWidth={48}
        value={parseCard(sale.card)}
        disabled
      />
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...sale.product.lease.card.user} />}
        iconWidth={48}
        value={parseCard(sale.product.lease.card)}
        disabled
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...sale.product} />}
        iconWidth={48}
        value={parseItem(sale.product.item)}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={sale.product.description || '-'}
        disabled
      />
      <TextInput
        label={t('columns.amount')}
        value={parseSaleAmount(sale)}
        disabled
      />
      <TextInput
        label={t('columns.sum')}
        value={`${sale.amount * sale.product.price}$`}
        disabled
      />
      <TextInput
        label={t('columns.storage')}
        value={parseCell(sale.product.lease.cell)}
        disabled
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...sale.product.lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(sale.product.lease.cell.storage.card)}
        disabled
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(sale.createdAt)}
        disabled
      />
      <Input.Wrapper label={t('columns.rate')}>
        <Rating value={sale.rate} readOnly />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewSaleAction = {
  open: (sale: Sale) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.sale'),
      children: <ViewSaleModal data={sale} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
