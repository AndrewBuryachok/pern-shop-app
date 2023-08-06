import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Payment } from './payment.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Payment>;

export default function ViewPaymentModal({ data: payment }: Props) {
  return (
    <Stack spacing={8}>
      <TextInput
        label='Sender'
        icon={<CustomAvatar {...payment.senderCard.user} />}
        iconWidth={48}
        value={parseCard(payment.senderCard)}
        disabled
      />
      <TextInput
        label='Receiver'
        icon={<CustomAvatar {...payment.receiverCard.user} />}
        iconWidth={48}
        value={parseCard(payment.receiverCard)}
        disabled
      />
      <TextInput label='Sum' value={`${payment.sum}$`} disabled />
      <Textarea label='Description' value={payment.description} disabled />
      <TextInput
        label='Created'
        value={parseTime(payment.createdAt)}
        disabled
      />
    </Stack>
  );
}

export const viewPaymentAction = {
  open: (payment: Payment) =>
    openModal({
      title: 'View Payment',
      children: <ViewPaymentModal data={payment} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
