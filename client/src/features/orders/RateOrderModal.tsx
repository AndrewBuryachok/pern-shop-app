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
import { useRateOrderMutation } from './orders.api';
import { RateOrderDto } from './order.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseThingAmount } from '../../common/utils';
import { Color, items, Status } from '../../common/constants';

type Props = IModal<Order>;

export default function RateOrderModal({ data: order }: Props) {
  const form = useForm({
    initialValues: {
      orderId: order.id,
      rate: order.rate || 0,
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
      text={'Rate order'}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label='Executor'
        icon={<CustomAvatar {...order.executorCard!.user} />}
        iconWidth={48}
        value={parseCard(order.executorCard!)}
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
      <Input.Wrapper label='Rate' required>
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

export const rateOrderAction = {
  open: (order: Order) =>
    openModal({
      title: 'Rate Order',
      children: <RateOrderModal data={order} />,
    }),
  disable: (order: Order) => order.status !== Status.COMPLETED,
  color: Color.YELLOW,
};
