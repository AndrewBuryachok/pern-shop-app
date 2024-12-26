import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Purchase } from './purchase.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseCell,
  parseItem,
  parsePlace,
  parsePurchaseAmount,
  parseStall,
  parseTime,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Purchase>;

export default function ViewPurchaseModal({ data: purchase }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={purchase.id} readOnly />
      <TextInput
        label={t('columns.buyer')}
        icon={<CustomAvatar {...purchase.card.user} />}
        iconWidth={48}
        value={parseCard(purchase.card)}
        readOnly
      />
      {purchase.good && (
        <TextInput
          label={t('columns.seller')}
          icon={<CustomAvatar {...purchase.good.shop.card.user} />}
          iconWidth={48}
          value={parseCard(purchase.good.shop.card)}
          readOnly
        />
      )}
      {purchase.ware && (
        <TextInput
          label={t('columns.seller')}
          icon={<CustomAvatar {...purchase.ware.rent.card.user} />}
          iconWidth={48}
          value={parseCard(purchase.ware.rent.card)}
          readOnly
        />
      )}
      {purchase.product && (
        <TextInput
          label={t('columns.seller')}
          icon={<CustomAvatar {...purchase.product.lease.card.user} />}
          iconWidth={48}
          value={parseCard(purchase.product.lease.card)}
          readOnly
        />
      )}
      {purchase.good && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...purchase.good} />}
          iconWidth={48}
          value={parseItem(purchase.good.item)}
          readOnly
        />
      )}
      {purchase.ware && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...purchase.ware} />}
          iconWidth={48}
          value={parseItem(purchase.ware.item)}
          readOnly
        />
      )}
      {purchase.product && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...purchase.product} />}
          iconWidth={48}
          value={parseItem(purchase.product.item)}
          readOnly
        />
      )}
      <Textarea
        label={t('columns.description')}
        value={
          purchase.good?.description ||
          purchase.ware?.description ||
          purchase.product?.description ||
          '-'
        }
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parsePurchaseAmount(purchase)}
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${
          purchase.amount *
          (purchase.good?.price ||
            purchase.ware?.price ||
            purchase.product?.price ||
            0)
        } ${t('constants.currency')}`}
        readOnly
      />
      {purchase.good && (
        <TextInput
          label={t('columns.shop')}
          value={parsePlace(purchase.good.shop)}
          readOnly
        />
      )}
      {purchase.ware && (
        <TextInput
          label={t('columns.market')}
          value={parseStall(purchase.ware.rent.stall)}
          readOnly
        />
      )}
      {purchase.product && (
        <TextInput
          label={t('columns.storage')}
          value={parseCell(purchase.product.lease.cell)}
          readOnly
        />
      )}
      {purchase.good && (
        <TextInput
          label={t('columns.owner')}
          icon={<CustomAvatar {...purchase.good.shop.card.user} />}
          iconWidth={48}
          value={parseCard(purchase.good.shop.card)}
          readOnly
        />
      )}
      {purchase.ware && (
        <TextInput
          label={t('columns.owner')}
          icon={<CustomAvatar {...purchase.ware.rent.stall.market.card.user} />}
          iconWidth={48}
          value={parseCard(purchase.ware.rent.stall.market.card)}
          readOnly
        />
      )}
      {purchase.product && (
        <TextInput
          label={t('columns.owner')}
          icon={
            <CustomAvatar {...purchase.product.lease.cell.storage.card.user} />
          }
          iconWidth={48}
          value={parseCard(purchase.product.lease.cell.storage.card)}
          readOnly
        />
      )}
      <TextInput
        label={t('columns.created')}
        value={parseTime(purchase.createdAt)}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')}>
        <Rating value={purchase.rate} readOnly />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewPurchaseAction = {
  open: (purchase: Purchase) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.purchases'),
      children: <ViewPurchaseModal data={purchase} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
