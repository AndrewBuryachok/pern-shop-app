import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Order } from './order.model';
import { useExecuteOrderMutation } from './orders.api';
import { OrderIdDto } from './order.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseThingAmount } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Order>;

export default function ExecuteOrderModal({ data: order }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      orderId: order.id,
    },
  });

  const [executeOrder, { isLoading }] = useExecuteOrderMutation();

  const handleSubmit = async (dto: OrderIdDto) => {
    await executeOrder(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.execute') + ' ' + t('modals.orders')}
    >
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...order.lease.card.user} />}
        iconWidth={48}
        value={parseCard(order.lease.card)}
        disabled
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...order} />}
        iconWidth={48}
        value={parseItem(order.item)}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={order.description || '-'}
        disabled
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(order)}
        disabled
      />
      <TextInput
        label={t('columns.price')}
        value={`${order.price}$`}
        disabled
      />
    </CustomForm>
  );
}

export const executeOrderAction = {
  open: (order: Order) =>
    openModal({
      title: t('actions.execute') + ' ' + t('modals.orders'),
      children: <ExecuteOrderModal data={order} />,
    }),
  disable: (order: Order) => order.status !== Status.TAKEN,
  color: Color.GREEN,
};
