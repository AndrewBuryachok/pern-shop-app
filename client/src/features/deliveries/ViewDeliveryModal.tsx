import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseCell,
  parseDate,
  parseThingAmount,
} from '../../common/utils';
import { Color, items } from '../../common/constants';

type Props = IModal<Delivery>;

export default function ViewDeliveryModal({ data: delivery }: Props) {
  const created = parseDate(delivery.createdAt);
  const completed = delivery.completedAt && parseDate(delivery.completedAt);

  return (
    <Stack spacing={8}>
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
        icon={
          delivery.executorCard && (
            <CustomAvatar {...delivery.executorCard.user} />
          )
        }
        iconWidth={48}
        value={delivery.executorCard ? parseCard(delivery.executorCard) : '-'}
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
      <TextInput
        label='Created'
        value={`${created.date} ${created.time}`}
        disabled
      />
      <TextInput
        label='Completed'
        value={completed ? `${completed.date} ${completed.time}` : '-'}
        disabled
      />
      <Input.Wrapper label='Rate'>
        <Rating value={delivery.rate} readOnly />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewDeliveryAction = {
  open: (delivery: Delivery) =>
    openModal({
      title: 'View Delivery',
      children: <ViewDeliveryModal data={delivery} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
