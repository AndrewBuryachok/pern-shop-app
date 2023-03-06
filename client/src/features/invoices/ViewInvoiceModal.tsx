import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Invoice } from './invoice.model';
import { parseCard, parseDate } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Invoice>;

export default function ViewInvoiceModal({ data: invoice }: Props) {
  const created = parseDate(invoice.createdAt);
  const completed = invoice.completedAt && parseDate(invoice.completedAt);

  return (
    <Stack spacing={8}>
      <TextInput
        label='Sender'
        value={parseCard(invoice.senderCard)}
        disabled
      />
      <TextInput
        label='Receiver'
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
        value={`${created.date} ${created.time}`}
        disabled
      />
      <TextInput
        label='Completed'
        value={completed ? `${completed.date} ${completed.time}` : '-'}
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
