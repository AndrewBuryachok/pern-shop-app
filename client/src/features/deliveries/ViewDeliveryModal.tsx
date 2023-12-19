import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseCell,
  parseItem,
  parseStatus,
  parseThingAmount,
  parseTime,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Delivery>;

export default function ViewDeliveryModal({ data: delivery }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={delivery.id} disabled />
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...delivery.fromLease.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.fromLease.card)}
        disabled
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...delivery} />}
        iconWidth={48}
        value={parseItem(delivery.item)}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={delivery.description || '-'}
        disabled
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(delivery)}
        disabled
      />
      <TextInput
        label={t('columns.price')}
        value={`${delivery.price}$`}
        disabled
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
        disabled
      />
      <TextInput
        label={t('columns.status')}
        value={parseStatus(delivery.status)}
        disabled
      />
      <TextInput
        label={t('columns.storage') + ' ' + t('columns.from')}
        value={parseCell(delivery.fromLease.cell)}
        disabled
      />
      <TextInput
        label={t('columns.owner') + ' ' + t('columns.from')}
        icon={<CustomAvatar {...delivery.fromLease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.fromLease.cell.storage.card)}
        disabled
      />
      <TextInput
        label={t('columns.storage') + ' ' + t('columns.to')}
        value={parseCell(delivery.toLease.cell)}
        disabled
      />
      <TextInput
        label={t('columns.owner') + ' ' + t('columns.to')}
        icon={<CustomAvatar {...delivery.toLease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.toLease.cell.storage.card)}
        disabled
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(delivery.createdAt)}
        disabled
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(delivery.completedAt)}
        disabled
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
      title: t('actions.view') + ' ' + t('modals.delivery'),
      children: <ViewDeliveryModal data={delivery} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
