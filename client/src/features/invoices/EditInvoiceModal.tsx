import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Invoice } from './invoice.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useEditInvoiceMutation } from './invoices.api';
import { EditInvoiceDto } from './invoice.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard } from '../../common/utils';
import {
  Color,
  MAX_DESCRIPTION_LENGTH,
  MAX_SUM_VALUE,
} from '../../common/constants';

type Props = IModal<Invoice>;

export default function EditInvoiceModal({ data: invoice }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      invoiceId: invoice.id,
      sum: invoice.sum,
      description: invoice.description,
    },
  });

  const [editInvoice, { isLoading }] = useEditInvoiceMutation();

  const handleSubmit = async (dto: EditInvoiceDto) => {
    await editInvoice(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.invoices')}
    >
      <TextInput
        label={t('columns.sender')}
        icon={<CustomAvatar {...invoice.senderCard.user} />}
        iconWidth={48}
        value={parseCard(invoice.senderCard)}
        readOnly
      />
      <TextInput
        label={t('columns.receiver')}
        icon={<CustomAvatar {...invoice.receiverUser} />}
        iconWidth={48}
        value={invoice.receiverUser.nick}
        readOnly
      />
      <NumberInput
        label={t('columns.sum')}
        placeholder={t('columns.sum')}
        required
        min={1}
        max={MAX_SUM_VALUE}
        {...form.getInputProps('sum')}
      />
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
    </CustomForm>
  );
}

export const editInvoiceFactory = (hasRole: boolean) => ({
  open: (invoice: Invoice) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.invoices'),
      children: <EditInvoiceModal data={invoice} />,
    }),
  disable: (invoice: Invoice) => {
    const user = getCurrentUser()!;
    return (
      (invoice.senderCard.user.id !== user.id && !hasRole) ||
      !!invoice.completedAt
    );
  },
  color: Color.YELLOW,
});

export const editMyInvoiceAction = editInvoiceFactory(false);

export const editUserInvoiceAction = editInvoiceFactory(true);
