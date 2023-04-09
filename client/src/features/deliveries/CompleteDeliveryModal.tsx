import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import { useCompleteDeliveryMutation } from '../deliveries/deliveries.api';
import { DeliveryIdDto } from '../deliveries/delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseCell, parseThingAmount } from '../../common/utils';
import { Color, items, Status } from '../../common/constants';
import { getCurrentUser } from '../auth/auth.slice';

type Props = IModal<Delivery>;

export default function CompleteDeliveryModal({ data: delivery }: Props) {
  const form = useForm({
    initialValues: {
      deliveryId: delivery.id,
    },
  });

  const [completeDelivery, { isLoading }] = useCompleteDeliveryMutation();

  const handleSubmit = async (dto: DeliveryIdDto) => {
    await completeDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Complete delivery'}
    >
      <TextInput
        label='Sender'
        icon={<CustomAvatar {...delivery.senderCard.user} />}
        iconWidth={48}
        value={parseCard(delivery.senderCard)}
        disabled
      />
      <TextInput
        label='Receiver'
        icon={<CustomAvatar {...delivery.receiverUser} />}
        iconWidth={48}
        value={delivery.receiverUser.name}
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
      <TextInput
        label='Executor'
        icon={<CustomAvatar {...delivery.executorCard!.user} />}
        iconWidth={48}
        value={parseCard(delivery.executorCard!)}
        disabled
      />
      <TextInput
        label='From Storage'
        value={parseCell(delivery.fromCell)}
        disabled
      />
      <TextInput
        label='From Owner'
        icon={<CustomAvatar {...delivery.fromCell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.fromCell.storage.card)}
        disabled
      />
      <TextInput
        label='To Storage'
        value={parseCell(delivery.toCell)}
        disabled
      />
      <TextInput
        label='To Owner'
        icon={<CustomAvatar {...delivery.toCell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.toCell.storage.card)}
        disabled
      />
    </CustomForm>
  );
}

export const completeDeliveryAction = {
  open: (delivery: Delivery) =>
    openModal({
      title: 'Complete Delivery',
      children: <CompleteDeliveryModal data={delivery} />,
    }),
  disable: (delivery: Delivery) => {
    const user = getCurrentUser()!;
    return (
      delivery.status !== Status.EXECUTED ||
      delivery.receiverUser.id !== user.id
    );
  },
  color: Color.GREEN,
};