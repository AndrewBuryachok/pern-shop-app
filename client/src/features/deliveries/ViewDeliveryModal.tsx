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
  parseItem,
  parsePlace,
  parsePurchaseAmount,
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
        icon={<CustomAvatar {...delivery.customerCard.user} />}
        iconWidth={48}
        value={parseCard(delivery.customerCard)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...delivery.purchase.good} />}
        iconWidth={48}
        value={parseItem(delivery.purchase.good.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={delivery.purchase.good.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parsePurchaseAmount(delivery.purchase)}
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${delivery.sum} ${t('constants.currency')}`}
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
      <TextInput
        label={t('columns.shop')}
        value={parsePlace(delivery.purchase.good.shop)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...delivery.purchase.good.shop.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.purchase.good.shop.card)}
        readOnly
      />
      <TextInput
        label={t('columns.station')}
        value={parsePlace(delivery.station)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...delivery.station.user} />}
        iconWidth={48}
        value={delivery.station.user.nick}
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
