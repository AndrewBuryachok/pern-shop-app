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
import { Delivery } from './delivery.model';
import { useRateDeliveryMutation } from './deliveries.api';
import { RateDeliveryDto } from './delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseThingAmount } from '../../common/utils';
import { Color, items, Status } from '../../common/constants';

type Props = IModal<Delivery>;

export default function RateDeliveryModal({ data: delivery }: Props) {
  const form = useForm({
    initialValues: {
      deliveryId: delivery.id,
      rate: delivery.rate || 0,
    },
  });

  const [rateDelivery, { isLoading }] = useRateDeliveryMutation();

  const handleSubmit = async (dto: RateDeliveryDto) => {
    await rateDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Rate delivery'}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label='Executor'
        icon={<CustomAvatar {...delivery.executorCard!.user} />}
        iconWidth={48}
        value={parseCard(delivery.executorCard!)}
        disabled
      />
      <TextInput
        label='Item'
        icon={<ThingImage {...delivery} />}
        iconWidth={48}
        value={items[delivery.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={delivery.description} disabled />
      <TextInput label='Amount' value={parseThingAmount(delivery)} disabled />
      <TextInput label='Price' value={`${delivery.price}$`} disabled />
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

export const rateDeliveryAction = {
  open: (delivery: Delivery) =>
    openModal({
      title: 'Rate Delivery',
      children: <RateDeliveryModal data={delivery} />,
    }),
  disable: (delivery: Delivery) => delivery.status !== Status.COMPLETED,
  color: Color.YELLOW,
};
