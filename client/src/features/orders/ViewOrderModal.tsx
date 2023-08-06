import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Order } from './order.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseCell,
  parseThingAmount,
  parseTime,
} from '../../common/utils';
import { Color, items } from '../../common/constants';

type Props = IModal<Order>;

export default function ViewOrderModal({ data: order }: Props) {
  return (
    <Stack spacing={8}>
      <TextInput
        label='Customer'
        icon={<CustomAvatar {...order.lease.card.user} />}
        iconWidth={48}
        value={parseCard(order.lease.card)}
        disabled
      />
      <TextInput
        label='Item'
        icon={<ThingImage {...order} />}
        iconWidth={48}
        value={items[order.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={order.description} disabled />
      <TextInput label='Amount' value={parseThingAmount(order)} disabled />
      <TextInput label='Price' value={`${order.price}$`} disabled />
      <TextInput label='Storage' value={parseCell(order.lease.cell)} disabled />
      <TextInput
        label='Executor'
        icon={
          order.executorCard && <CustomAvatar {...order.executorCard.user} />
        }
        iconWidth={48}
        value={order.executorCard ? parseCard(order.executorCard) : '-'}
        disabled
      />
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...order.lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(order.lease.cell.storage.card)}
        disabled
      />
      <TextInput label='Created' value={parseTime(order.createdAt)} disabled />
      <TextInput
        label='Completed'
        value={parseTime(order.completedAt)}
        disabled
      />
      <Input.Wrapper label='Rate'>
        <Rating value={order.rate} readOnly />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewOrderAction = {
  open: (order: Order) =>
    openModal({
      title: 'View Order',
      children: <ViewOrderModal data={order} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
