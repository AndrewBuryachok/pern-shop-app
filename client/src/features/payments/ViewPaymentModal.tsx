import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Payment } from './payment.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Payment>;

export default function ViewPaymentModal({ data: payment }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={payment.id} readOnly />
      <TextInput
        label={t('columns.sender')}
        icon={<CustomAvatar {...payment.senderCard.user} />}
        iconWidth={48}
        value={parseCard(payment.senderCard)}
        readOnly
      />
      <TextInput
        label={t('columns.receiver')}
        icon={<CustomAvatar {...payment.receiverCard.user} />}
        iconWidth={48}
        value={parseCard(payment.receiverCard)}
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${payment.sum} ${t('constants.currency')}`}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={payment.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(payment.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewPaymentAction = {
  open: (payment: Payment) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.payments'),
      children: <ViewPaymentModal data={payment} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
