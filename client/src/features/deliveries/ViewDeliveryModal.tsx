import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseBox,
  parseCard,
  parseCell,
  parseItem,
  parsePlace,
  parsePurchaseAmount,
  parseStall,
  parseStatus,
  parseTime,
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
      {delivery.purchase.good && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...delivery.purchase.good} />}
          iconWidth={48}
          value={parseItem(delivery.purchase.good.item)}
          readOnly
        />
      )}
      {delivery.purchase.ware && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...delivery.purchase.ware} />}
          iconWidth={48}
          value={parseItem(delivery.purchase.ware.item)}
          readOnly
        />
      )}
      {delivery.purchase.product && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...delivery.purchase.product} />}
          iconWidth={48}
          value={parseItem(delivery.purchase.product.item)}
          readOnly
        />
      )}
      <Textarea
        label={t('columns.description')}
        value={
          delivery.purchase.good?.description ||
          delivery.purchase.ware?.description ||
          delivery.purchase.product?.description ||
          '-'
        }
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parsePurchaseAmount(delivery.purchase)}
        readOnly
      />
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
      {delivery.purchase.good && (
        <TextInput
          label={t('columns.fromShop')}
          value={parsePlace(delivery.purchase.good.shop)}
          readOnly
        />
      )}
      {delivery.purchase.ware && (
        <TextInput
          label={t('columns.fromMarket')}
          value={parseStall(delivery.purchase.ware.rent.stall)}
          readOnly
        />
      )}
      {delivery.purchase.product && (
        <TextInput
          label={t('columns.fromStorage')}
          value={parseCell(delivery.purchase.product.lease.cell)}
          readOnly
        />
      )}
      {delivery.purchase.good && (
        <TextInput
          label={t('columns.owner')}
          icon={<CustomAvatar {...delivery.purchase.good.shop.card.user} />}
          iconWidth={48}
          value={parseCard(delivery.purchase.good.shop.card)}
          readOnly
        />
      )}
      {delivery.purchase.ware && (
        <TextInput
          label={t('columns.owner')}
          icon={
            <CustomAvatar
              {...delivery.purchase.ware.rent.stall.market.card.user}
            />
          }
          iconWidth={48}
          value={parseCard(delivery.purchase.ware.rent.stall.market.card)}
          readOnly
        />
      )}
      {delivery.purchase.product && (
        <TextInput
          label={t('columns.owner')}
          icon={
            <CustomAvatar
              {...delivery.purchase.product.lease.cell.storage.card.user}
            />
          }
          iconWidth={48}
          value={parseCard(delivery.purchase.product.lease.cell.storage.card)}
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
