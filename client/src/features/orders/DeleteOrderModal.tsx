import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Order } from './order.model';
import { useDeleteOrderMutation } from '../orders/orders.api';
import { OrderIdDto } from '../orders/order.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseCell, parseThingAmount } from '../../common/utils';
import { Color, items, Status } from '../../common/constants';

type Props = IModal<Order>;

export default function DeleteOrderModal({ data: order }: Props) {
  const form = useForm({
    initialValues: {
      orderId: order.id,
    },
  });

  const [deleteOrder, { isLoading }] = useDeleteOrderMutation();

  const handleSubmit = async (dto: OrderIdDto) => {
    await deleteOrder(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Delete order'}
    >
      <TextInput
        label='Customer'
        icon={<CustomAvatar {...order.customerCard.user} />}
        iconWidth={48}
        value={parseCard(order.customerCard)}
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
      <TextInput label='Storage' value={parseCell(order.cell)} disabled />
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...order.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(order.cell.storage.card)}
        disabled
      />
    </CustomForm>
  );
}

export const deleteOrderAction = {
  open: (order: Order) =>
    openModal({
      title: 'Delete Order',
      children: <DeleteOrderModal data={order} />,
    }),
  disable: (order: Order) => order.status !== Status.CREATED,
  color: Color.RED,
};
