import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import { useExecuteDeliveryMutation } from '../deliveries/deliveries.api';
import { DeliveryIdDto } from '../deliveries/delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseCell, parseThingAmount } from '../../common/utils';
import { Color, items, Status } from '../../common/constants';
import { getCurrentUser } from '../auth/auth.slice';

type Props = IModal<Delivery>;

export default function ExecuteDeliveryModal({ data: delivery }: Props) {
  const form = useForm({
    initialValues: {
      deliveryId: delivery.id,
    },
  });

  const [executeDelivery, { isLoading }] = useExecuteDeliveryMutation();

  const handleSubmit = async (dto: DeliveryIdDto) => {
    await executeDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Execute delivery'}
    >
      <TextInput
        label='Sender'
        icon={<CustomAvatar {...delivery.fromLease.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.fromLease.card)}
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
        value={parseCell(delivery.fromLease.cell)}
        disabled
      />
      <TextInput
        label='From Owner'
        icon={<CustomAvatar {...delivery.fromLease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.fromLease.cell.storage.card)}
        disabled
      />
      <TextInput
        label='To Storage'
        value={parseCell(delivery.toLease.cell)}
        disabled
      />
      <TextInput
        label='To Owner'
        icon={<CustomAvatar {...delivery.toLease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.toLease.cell.storage.card)}
        disabled
      />
    </CustomForm>
  );
}

export const executeDeliveryAction = {
  open: (delivery: Delivery) =>
    openModal({
      title: 'Execute Delivery',
      children: <ExecuteDeliveryModal data={delivery} />,
    }),
  disable: (delivery: Delivery) => {
    const user = getCurrentUser()!;
    return (
      delivery.status !== Status.TAKEN ||
      delivery.executorCard?.user.id !== user.id
    );
  },
  color: Color.GREEN,
};
