import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Payment } from './payment.model';
import { useDeletePaymentMutation } from './payments.api';
import { DeletePaymentDto } from './payment.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Payment>;

export default function DeletePaymentModal({ data: payment }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      paymentId: payment.id,
    },
  });

  const [deletePayment, { isLoading }] = useDeletePaymentMutation();

  const handleSubmit = async (dto: DeletePaymentDto) => {
    await deletePayment(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.payments')}
    >
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
    </CustomForm>
  );
}

export const deletePaymentAction = {
  open: (payment: Payment) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.payments'),
      children: <DeletePaymentModal data={payment} />,
    }),
  disable: () => false,
  color: Color.RED,
};
