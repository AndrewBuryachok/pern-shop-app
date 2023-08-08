import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Order } from './order.model';
import { useUntakeOrderMutation } from '../orders/orders.api';
import { OrderIdDto } from '../orders/order.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseCell, parseThingAmount } from '../../common/utils';
import { Color, items, Status } from '../../common/constants';
import { getCurrentUser } from '../auth/auth.slice';

type Props = IModal<Order>;

export default function UntakeOrderModal({ data: order }: Props) {
  const form = useForm({
    initialValues: {
      orderId: order.id,
    },
  });

  const [untakeOrder, { isLoading }] = useUntakeOrderMutation();

  const handleSubmit = async (dto: OrderIdDto) => {
    await untakeOrder(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Untake order'}
    >
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
      <TextInput
        label='Executor'
        icon={<CustomAvatar {...order.executorCard!.user} />}
        iconWidth={48}
        value={parseCard(order.executorCard!)}
        disabled
      />
      <TextInput label='Storage' value={parseCell(order.lease.cell)} disabled />
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...order.lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(order.lease.cell.storage.card)}
        disabled
      />
    </CustomForm>
  );
}

export const untakeOrderFactory = (hasRole: boolean) => ({
  open: (order: Order) =>
    openModal({
      title: 'Untake Order',
      children: <UntakeOrderModal data={order} />,
    }),
  disable: (order: Order) => {
    const user = getCurrentUser()!;
    return (
      order.status !== Status.TAKEN ||
      (order.executorCard?.user.id !== user.id && !hasRole)
    );
  },
  color: Color.RED,
});

export const untakeMyOrderAction = untakeOrderFactory(false);

export const untakeUserOrderAction = untakeOrderFactory(true);
