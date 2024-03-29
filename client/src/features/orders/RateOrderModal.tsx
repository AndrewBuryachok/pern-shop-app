import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Order } from './order.model';
import { useRateOrderMutation } from './orders.api';
import { RateOrderDto } from './order.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseThingAmount } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Order>;

export default function RateOrderModal({ data: order }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      orderId: order.id,
      rate: 5,
    },
  });

  const [rateOrder, { isLoading }] = useRateOrderMutation();

  const handleSubmit = async (dto: RateOrderDto) => {
    await rateOrder(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.rate') + ' ' + t('modals.orders')}
    >
      <TextInput
        label={t('columns.executor')}
        icon={
          order.executorCard && <CustomAvatar {...order.executorCard.user} />
        }
        iconWidth={48}
        value={order.executorCard ? parseCard(order.executorCard) : '-'}
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
      <Input.Wrapper label={t('columns.rate')} required>
        <Rating {...form.getInputProps('rate')} />
      </Input.Wrapper>
    </CustomForm>
  );
}

export const rateOrderAction = {
  open: (order: Order) =>
    openModal({
      title: t('actions.rate') + ' ' + t('modals.orders'),
      children: <RateOrderModal data={order} />,
    }),
  disable: (order: Order) => order.status !== Status.COMPLETED || !!order.rate,
  color: Color.YELLOW,
};
