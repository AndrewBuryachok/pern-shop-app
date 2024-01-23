import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Order } from './order.model';
import { useDeleteOrderMutation } from './orders.api';
import { OrderIdDto } from './order.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseThingAmount } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Order>;

export default function DeleteOrderModal({ data: order }: Props) {
  const [t] = useTranslation();

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
      text={t('actions.delete') + ' ' + t('modals.orders')}
    >
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...order.lease.card.user} />}
        iconWidth={48}
        value={parseCard(order.lease.card)}
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
    </CustomForm>
  );
}

export const deleteOrderAction = {
  open: (order: Order) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.orders'),
      children: <DeleteOrderModal data={order} />,
    }),
  disable: (order: Order) => order.status !== Status.CREATED,
  color: Color.RED,
};
