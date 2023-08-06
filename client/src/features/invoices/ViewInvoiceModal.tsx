import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Invoice } from './invoice.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Invoice>;

export default function ViewInvoiceModal({ data: invoice }: Props) {
  return (
    <Stack spacing={8}>
      <TextInput
        label='Sender'
        icon={<CustomAvatar {...invoice.senderCard.user} />}
        iconWidth={48}
        value={parseCard(invoice.senderCard)}
        disabled
      />
      <TextInput
        label='Receiver'
        icon={<CustomAvatar {...invoice.receiverUser} />}
        iconWidth={48}
        value={
          invoice.receiverCard
            ? parseCard(invoice.receiverCard)
            : invoice.receiverUser.name
        }
        disabled
      />
      <TextInput label='Sum' value={`${invoice.sum}$`} disabled />
      <Textarea label='Description' value={invoice.description} disabled />
      <TextInput
        label='Created'
        value={parseTime(invoice.createdAt)}
        disabled
      />
      <TextInput
        label='Completed'
        value={parseTime(invoice.completedAt)}
        disabled
      />
    </Stack>
  );
}

export const viewInvoiceAction = {
  open: (invoice: Invoice) =>
    openModal({
      title: 'View Invoice',
      children: <ViewInvoiceModal data={invoice} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
