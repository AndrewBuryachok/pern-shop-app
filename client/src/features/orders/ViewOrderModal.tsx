import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Order } from './order.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseDrawer,
  parseItem,
  parseStatus,
  parseThingAmount,
  parseTime,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Order>;

export default function ViewOrderModal({ data: order }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={order.id} readOnly />
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...order.hire.card.user} />}
        iconWidth={48}
        value={parseCard(order.hire.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...order} />}
        iconWidth={48}
        value={parseItem(order.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={order.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(order)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${order.price} ${t('constants.currency')}`}
        readOnly
      />
      <TextInput
        label={t('columns.status')}
        value={parseStatus(order.status)}
        readOnly
      />
      <TextInput
        label={t('columns.executor')}
        icon={
          order.executorCard && <CustomAvatar {...order.executorCard.user} />
        }
        iconWidth={48}
        value={order.executorCard ? parseCard(order.executorCard) : '-'}
        readOnly
      />
      <TextInput
        label={t('columns.station')}
        value={parseDrawer(order.hire.drawer)}
        readOnly
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...order.hire.drawer.station.card.user} />}
        iconWidth={48}
        value={parseCard(order.hire.drawer.station.card)}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(order.createdAt)}
        readOnly
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(order.completedAt)}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')}>
        <Rating value={order.rate} readOnly />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewOrderAction = {
  open: (order: Order) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.orders'),
      children: <ViewOrderModal data={order} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
