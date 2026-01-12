import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  CloseButton,
  Group,
  Input,
  Rating,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Order } from './order.model';
import { useCompleteOrderMutation } from './orders.api';
import { CompleteOrderDto } from './order.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseThingAmount } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Order>;

export default function CompleteOrderModal({ data: order }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      orderId: order.id,
      rate: 0,
    },
  });

  const [completeOrder, { isLoading }] = useCompleteOrderMutation();

  const handleSubmit = async (dto: CompleteOrderDto) => {
    await completeOrder(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.complete') + ' ' + t('modals.orders')}
    >
      <TextInput
        label={t('columns.executor')}
        icon={<CustomAvatar {...order.executorCard!.user} />}
        iconWidth={48}
        value={parseCard(order.executorCard!)}
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
        label={t('columns.sum')}
        value={`${order.sum} ${t('constants.currency')}`}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')}>
        <Group spacing={8}>
          <Rating {...form.getInputProps('rate')} />
          <CloseButton
            size={24}
            iconSize={16}
            onClick={() => form.setFieldValue('rate', 0)}
          />
        </Group>
      </Input.Wrapper>
    </CustomForm>
  );
}

export const completeOrderAction = {
  open: (order: Order) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.orders'),
      children: <CompleteOrderModal data={order} />,
    }),
  disable: (order: Order) => order.status !== Status.EXECUTED,
  color: Color.GREEN,
};
