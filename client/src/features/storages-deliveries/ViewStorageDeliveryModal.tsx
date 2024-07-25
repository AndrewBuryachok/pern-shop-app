import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { StorageDelivery } from './storage-delivery.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseCell,
  parseDrawer,
  parseItem,
  parseSaleAmount,
  parseStatus,
  parseTime,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<StorageDelivery>;

export default function ViewStorageDeliveryModal({
  data: storageDelivery,
}: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={storageDelivery.id} readOnly />
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...storageDelivery.hire.card.user} />}
        iconWidth={48}
        value={parseCard(storageDelivery.hire.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...storageDelivery.sale.product} />}
        iconWidth={48}
        value={parseItem(storageDelivery.sale.product.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={storageDelivery.sale.product.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseSaleAmount(storageDelivery.sale)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${storageDelivery.price} ${t('constants.currency')}`}
        readOnly
      />
      <TextInput
        label={t('columns.executor')}
        icon={
          storageDelivery.executorCard && (
            <CustomAvatar {...storageDelivery.executorCard.user} />
          )
        }
        iconWidth={48}
        value={
          storageDelivery.executorCard
            ? parseCard(storageDelivery.executorCard)
            : '-'
        }
        readOnly
      />
      <TextInput
        label={t('columns.status')}
        value={parseStatus(storageDelivery.status)}
        readOnly
      />
      <TextInput
        label={t('columns.fromStorage')}
        value={parseCell(storageDelivery.sale.product.lease.cell)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={
          <CustomAvatar
            {...storageDelivery.sale.product.lease.cell.storage.card.user}
          />
        }
        iconWidth={48}
        value={parseCard(storageDelivery.sale.product.lease.cell.storage.card)}
        readOnly
      />
      <TextInput
        label={t('columns.toStation')}
        value={parseDrawer(storageDelivery.hire.drawer)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={
          <CustomAvatar {...storageDelivery.hire.drawer.station.card.user} />
        }
        iconWidth={48}
        value={parseCard(storageDelivery.hire.drawer.station.card)}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(storageDelivery.createdAt)}
        readOnly
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(storageDelivery.completedAt)}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')}>
        <Rating value={storageDelivery.rate} readOnly />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewStorageDeliveryAction = {
  open: (storageDelivery: StorageDelivery) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.deliveries'),
      children: <ViewStorageDeliveryModal data={storageDelivery} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
