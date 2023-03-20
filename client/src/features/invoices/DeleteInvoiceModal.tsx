import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Invoice } from './invoice.model';
import { useDeleteInvoiceMutation } from './invoices.api';
import { DeleteInvoiceDto } from './invoice.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseDate } from '../../common/utils';
import { Color } from '../../common/constants';
import { getCurrentUser } from '../auth/auth.slice';

type Props = IModal<Invoice>;

export default function DeleteInvoiceModal({ data: invoice }: Props) {
  const created = parseDate(invoice.createdAt);

  const form = useForm({
    initialValues: {
      invoiceId: invoice.id,
    },
  });

  const [deleteInvoice, { isLoading }] = useDeleteInvoiceMutation();

  const handleSubmit = async (dto: DeleteInvoiceDto) => {
    await deleteInvoice(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Delete invoice'}
    >
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
        value={`${created.date} ${created.time}`}
        disabled
      />
    </CustomForm>
  );
}

export const deleteInvoiceAction = {
  open: (invoice: Invoice) =>
    openModal({
      title: 'Delete Invoice',
      children: <DeleteInvoiceModal data={invoice} />,
    }),
  disable: (invoice: Invoice) => {
    const user = getCurrentUser()!;
    return !!invoice.completedAt || invoice.senderCard.user.id !== user.id;
  },
  color: Color.RED,
};
