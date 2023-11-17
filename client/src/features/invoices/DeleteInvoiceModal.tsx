import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Invoice } from './invoice.model';
import { useDeleteInvoiceMutation } from './invoices.api';
import { DeleteInvoiceDto } from './invoice.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Invoice>;

export default function DeleteInvoiceModal({ data: invoice }: Props) {
  const [t] = useTranslation();

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
      text={t('actions.delete') + ' ' + t('modals.invoice')}
    >
      <TextInput
        label={t('columns.sender')}
        icon={<CustomAvatar {...invoice.senderCard.user} />}
        iconWidth={48}
        value={parseCard(invoice.senderCard)}
        disabled
      />
      <TextInput
        label={t('columns.receiver')}
        icon={<CustomAvatar {...invoice.receiverUser} />}
        iconWidth={48}
        value={
          invoice.receiverCard
            ? parseCard(invoice.receiverCard)
            : invoice.receiverUser.name
        }
        disabled
      />
      <TextInput label={t('columns.sum')} value={`${invoice.sum}$`} disabled />
      <Textarea
        label={t('columns.description')}
        value={invoice.description}
        disabled
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(invoice.createdAt)}
        disabled
      />
    </CustomForm>
  );
}

export const deleteInvoiceAction = {
  open: (invoice: Invoice) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.invoice'),
      children: <DeleteInvoiceModal data={invoice} />,
    }),
  disable: (invoice: Invoice) => !!invoice.completedAt,
  color: Color.RED,
};
