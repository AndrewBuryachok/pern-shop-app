import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Invoice } from './invoice.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Invoice>;

export default function ViewInvoiceModal({ data: invoice }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={invoice.id} disabled />
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
            : invoice.receiverUser.nick
        }
        disabled
      />
      <TextInput
        label={t('columns.sum')}
        value={`${invoice.sum} ${t('constants.currency')}`}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={invoice.description || '-'}
        disabled
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(invoice.createdAt)}
        disabled
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(invoice.completedAt)}
        disabled
      />
    </Stack>
  );
}

export const viewInvoiceAction = {
  open: (invoice: Invoice) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.invoices'),
      children: <ViewInvoiceModal data={invoice} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
