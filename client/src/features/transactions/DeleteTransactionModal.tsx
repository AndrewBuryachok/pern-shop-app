import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Transaction } from './transaction.model';
import { useDeleteTransactionMutation } from './transactions.api';
import { DeleteTransactionDto } from './transaction.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Transaction>;

export default function DeleteTransactionModal({ data: transaction }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      transactionId: transaction.id,
    },
  });

  const [deleteTransaction, { isLoading }] = useDeleteTransactionMutation();

  const handleSubmit = async (dto: DeleteTransactionDto) => {
    await deleteTransaction(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.transactions')}
    >
      <TextInput
        label={t('columns.sender')}
        icon={
          <CustomAvatar
            {...(transaction.senderCard?.user || transaction.executorUser!)}
          />
        }
        iconWidth={48}
        value={
          transaction.senderCard
            ? parseCard(transaction.senderCard)
            : transaction.executorUser!.nick
        }
        readOnly
      />
      <TextInput
        label={t('columns.receiver')}
        icon={
          <CustomAvatar
            {...(transaction.receiverCard?.user || transaction.executorUser!)}
          />
        }
        iconWidth={48}
        value={
          transaction.receiverCard
            ? parseCard(transaction.receiverCard)
            : transaction.executorUser!.nick
        }
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${transaction.sum} ${t('constants.currency')}`}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        icon={transaction.item && <ThingImage item={transaction.item} />}
        iconWidth={48}
        value={transaction.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(transaction.createdAt)}
        readOnly
      />
    </CustomForm>
  );
}

export const deleteTransactionAction = {
  open: (transaction: Transaction) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.transactions'),
      children: <DeleteTransactionModal data={transaction} />,
    }),
  disable: () => false,
  color: Color.RED,
};
