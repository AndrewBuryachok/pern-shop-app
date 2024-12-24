import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseBargainAmount,
  parseBox,
  parseCard,
  parseCell,
  parseItem,
  parsePlace,
  parseSaleAmount,
  parseStall,
  parseStatus,
  parseTime,
  parseTradeAmount,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Delivery>;

export default function ViewDeliveryModal({ data: delivery }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={delivery.id} readOnly />
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...delivery.hire.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.hire.card)}
        readOnly
      />
      {delivery.bargain && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...delivery.bargain.good} />}
          iconWidth={48}
          value={parseItem(delivery.bargain.good.item)}
          readOnly
        />
      )}
      {delivery.trade && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...delivery.trade.ware} />}
          iconWidth={48}
          value={parseItem(delivery.trade.ware.item)}
          readOnly
        />
      )}
      {delivery.sale && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...delivery.sale.product} />}
          iconWidth={48}
          value={parseItem(delivery.sale.product.item)}
          readOnly
        />
      )}
      <Textarea
        label={t('columns.description')}
        value={
          delivery.bargain?.good.description ||
          delivery.trade?.ware.description ||
          delivery.sale?.product.description ||
          '-'
        }
        readOnly
      />
      {delivery.bargain && (
        <TextInput
          label={t('columns.amount')}
          value={parseBargainAmount(delivery.bargain)}
          readOnly
        />
      )}
      {delivery.trade && (
        <TextInput
          label={t('columns.amount')}
          value={parseTradeAmount(delivery.trade)}
          readOnly
        />
      )}
      {delivery.sale && (
        <TextInput
          label={t('columns.amount')}
          value={parseSaleAmount(delivery.sale)}
          readOnly
        />
      )}
      <TextInput
        label={t('columns.price')}
        value={`${delivery.price} ${t('constants.currency')}`}
        readOnly
      />
      <TextInput
        label={t('columns.status')}
        value={parseStatus(delivery.status)}
        readOnly
      />
      <TextInput
        label={t('columns.executor')}
        icon={
          delivery.executorCard && (
            <CustomAvatar {...delivery.executorCard.user} />
          )
        }
        iconWidth={48}
        value={delivery.executorCard ? parseCard(delivery.executorCard) : '-'}
        readOnly
      />
      {delivery.bargain && (
        <TextInput
          label={t('columns.fromShop')}
          value={parsePlace(delivery.bargain.good.shop)}
          readOnly
        />
      )}
      {delivery.trade && (
        <TextInput
          label={t('columns.fromMarket')}
          value={parseStall(delivery.trade.ware.rent.stall)}
          readOnly
        />
      )}
      {delivery.sale && (
        <TextInput
          label={t('columns.fromStorage')}
          value={parseCell(delivery.sale.product.lease.cell)}
          readOnly
        />
      )}
      {delivery.bargain && (
        <TextInput
          label={t('columns.owner')}
          icon={<CustomAvatar {...delivery.bargain.good.shop.card.user} />}
          iconWidth={48}
          value={parseCard(delivery.bargain.good.shop.card)}
          readOnly
        />
      )}
      {delivery.trade && (
        <TextInput
          label={t('columns.owner')}
          icon={
            <CustomAvatar
              {...delivery.trade.ware.rent.stall.market.card.user}
            />
          }
          iconWidth={48}
          value={parseCard(delivery.trade.ware.rent.stall.market.card)}
          readOnly
        />
      )}
      {delivery.sale && (
        <TextInput
          label={t('columns.owner')}
          icon={
            <CustomAvatar
              {...delivery.sale.product.lease.cell.storage.card.user}
            />
          }
          iconWidth={48}
          value={parseCard(delivery.sale.product.lease.cell.storage.card)}
          readOnly
        />
      )}
      <TextInput
        label={t('columns.toStation')}
        value={parseBox(delivery.hire.box)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...delivery.hire.box.station.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.hire.box.station.card)}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(delivery.createdAt)}
        readOnly
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(delivery.completedAt)}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')}>
        <Rating value={delivery.rate} readOnly />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewDeliveryAction = {
  open: (delivery: Delivery) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.deliveries'),
      children: <ViewDeliveryModal data={delivery} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
